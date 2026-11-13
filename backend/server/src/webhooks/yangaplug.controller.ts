

// import {
//   Body,
//   Controller,
//   HttpCode,
//   InternalServerErrorException,
//   Logger,
//   NotFoundException,
//   Param,
//   Post,
// } from '@nestjs/common';
// import * as crypto from 'crypto';
// import { SettlementService } from 'src/data/settlement.service';

// /**
//  * Set this URL as the webhook in your Yangaplug dashboard (if it has a webhook setting):
//  *   https://<your-backend-domain>/webhooks/yangaplug/<YANGAPLUG_WEBHOOK_TOKEN>
//  *
//  * The body is only a hint about WHICH order changed. The real outcome always comes
//  * from asking Yangaplug (requery), exactly like the Sabuss webhook did.
//  *
//  * NOTE: the body shape below is a guess (no webhook docs yet). It looks for our request_id
//  * in a few likely places. Check the first real webhook in your logs and tighten it.
//  */
// @Controller('webhooks/yangaplug')
// export class YangaplugWebhookController {
//   private readonly logger = new Logger(YangaplugWebhookController.name);

//   constructor(private settlement: SettlementService) {}

//   private tokenOk(token: string): boolean {
//     const expected = process.env.YANGAPLUG_WEBHOOK_TOKEN;
//     if (!expected) return false;
//     const a = Buffer.from(token);
//     const b = Buffer.from(expected);
//     return a.length === b.length && crypto.timingSafeEqual(a, b);
//   }

//   private extractReference(body: any): string | null {
//     const candidates = [
//       body?.request_id,
//       body?.data?.request_id,
//       body?.data?.payment?.request_id,
//       body?.payment?.request_id,
//     ];
//     const hit = candidates.find((c) => typeof c === 'string' && c.length > 0);
//     return hit ?? null;
//   }

//   @Post(':token')
//   @HttpCode(200)
//   async handle(@Param('token') token: string, @Body() body: any) {
//     if (!this.tokenOk(token)) throw new NotFoundException(); // look like the route doesn't exist

//     const reference = this.extractReference(body);
//     if (!reference) {
//       // log only the shape (field names), not the content
//       this.logger.warn(
//         `Yangaplug webhook without a request_id. Keys: ${Object.keys(body ?? {}).join(',')} | data keys: ${Object.keys(body?.data ?? {}).join(',')}`,
//       );
//       return { ok: true };
//     }

//     try {
//       await this.settlement.reconcile(reference);
//     } catch (err: any) {
//       // 500 so Yangaplug may retry; the reconciliation job also covers this
//       this.logger.error(`Webhook for ${reference} failed: ${err?.message}`);
//       throw new InternalServerErrorException();
//     }
//     return { ok: true };
//   }
// }





import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { SettlementService } from 'src/data/settlement.service';
import { PrismaService } from 'src/prisma.service';

/**
 * Set this URL as the webhook in your Yangaplug dashboard:
 *   https://<your-backend-domain>/webhooks/yangaplug/<YANGAPLUG_WEBHOOK_TOKEN>
 *
 * Every event is { event, data }. For bill payments the body is only a hint about WHICH order changed:
 * the real outcome always comes from asking Yangaplug (requery).
 * Card events are handled below; the exact card payload fields are not in the public docs, so the
 * handlers check a few likely field names and log the key names of anything unexpected.
 */
@Controller('webhooks/yangaplug')
export class YangaplugWebhookController {
  private readonly logger = new Logger(YangaplugWebhookController.name);

  constructor(
    private settlement: SettlementService,
    private prisma: PrismaService,
  ) {}

  private tokenOk(token: string): boolean {
    const expected = process.env.YANGAPLUG_WEBHOOK_TOKEN;
    if (!expected) return false;
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }

  private extractReference(body: any): string | null {
    const candidates = [
      body?.request_id,
      body?.data?.request_id,
      body?.data?.payment?.request_id,
      body?.payment?.request_id,
    ];
    const hit = candidates.find((c) => typeof c === 'string' && c.length > 0);
    return hit ?? null;
  }

  @Post(':token')
  @HttpCode(200)
  async handle(@Param('token') token: string, @Body() body: any) {
    if (!this.tokenOk(token)) throw new NotFoundException(); // look like the route doesn't exist

    const event = typeof body?.event === 'string' ? body.event : null;

    // ----- card events -----
    if (event && (event.startsWith('card') || event.startsWith('cardholder'))) {
      try {
        await this.handleCardEvent(event, body?.data);
      } catch (err: any) {
        this.logger.error(`Card webhook ${event} failed: ${err?.message}`);
        throw new InternalServerErrorException(); // 500 so Yangaplug may retry
      }
      return { ok: true };
    }

    // ----- bill payment events -----
    const reference = this.extractReference(body);
    if (!reference) {
      // log only the shape (field names), not the content
      this.logger.warn(
        `Yangaplug webhook without a request_id. Event: ${event ?? 'none'} | Keys: ${Object.keys(body ?? {}).join(',')} | data keys: ${Object.keys(body?.data ?? {}).join(',')}`,
      );
      return { ok: true };
    }

    try {
      await this.settlement.reconcile(reference);
    } catch (err: any) {
      // 500 so Yangaplug may retry; the reconciliation job also covers this
      this.logger.error(`Webhook for ${reference} failed: ${err?.message}`);
      throw new InternalServerErrorException();
    }
    return { ok: true };
  }

  // ---------- cards ----------

  private async handleCardEvent(event: string, data: any) {
    switch (event) {
      case 'cardholder.created': {
        const c = data?.cardholder ?? data;
        const id = c?.id ? String(c.id) : null;
        if (id && c?.kyc_verified === true) {
          await this.prisma.cardholder.updateMany({ where: { yangaplugId: id }, data: { status: 'VERIFIED' } });
        }
        return;
      }

      case 'card.created': {
        const c = data?.card ?? data;
        const cardId = c?.id ? String(c.id) : null;
        if (!cardId) {
          this.logger.warn(`card.created without an id. data keys: ${Object.keys(data ?? {}).join(',')}`);
          return;
        }

        const rawStatus = String(c?.status ?? '').toLowerCase();
        const status = rawStatus.includes('fail') ? 'FAILED' : 'ACTIVE';
        const last4 = this.last4(c);

        // 1) a row we already linked by Yangaplug id
        let row = await this.prisma.card.findUnique({ where: { yangaplugId: cardId } });

        // 2) otherwise the oldest PENDING card of that cardholder that has no Yangaplug id yet
        if (!row) {
          const holderRemoteId = String(c?.cardholder_id ?? c?.cardholder?.id ?? data?.cardholder_id ?? '');
          if (holderRemoteId) {
            const holder = await this.prisma.cardholder.findUnique({ where: { yangaplugId: holderRemoteId } });
            if (holder) {
              row = await this.prisma.card.findFirst({
                where: { cardholderId: holder.id, status: 'PENDING', yangaplugId: null },
                orderBy: { createdAt: 'asc' },
              });
            }
          }
        }

        if (!row) {
          this.logger.warn(`card.created ${cardId}: no matching card, needs manual review`);
          return;
        }

        await this.prisma.card.update({
          where: { id: row.id },
          data: { yangaplugId: cardId, status, ...(last4 ? { last4 } : {}) },
        });
        return;
      }

      case 'card.transaction':
        // Payload fields are not documented yet. Log the shape once, store nothing until we have seen a real one.
        this.logger.log(`card.transaction received. data keys: ${Object.keys(data ?? {}).join(',')}`);
        return;

      default:
        return; // acknowledge events we don't handle
    }
  }

  /** Only the last 4 digits are ever kept. */
  private last4(c: any): string | null {
    const direct = c?.last4 ?? c?.last_four ?? c?.last_4;
    if (direct) return String(direct).slice(-4);
    const masked = c?.masked_pan ?? c?.masked_number ?? c?.pan;
    if (masked && /\d{4}$/.test(String(masked))) return String(masked).slice(-4);
    return null;
  }
}