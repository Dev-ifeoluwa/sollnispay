

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

/**
 * Set this URL as the webhook in your Yangaplug dashboard (if it has a webhook setting):
 *   https://<your-backend-domain>/webhooks/yangaplug/<YANGAPLUG_WEBHOOK_TOKEN>
 *
 * The body is only a hint about WHICH order changed. The real outcome always comes
 * from asking Yangaplug (requery), exactly like the Sabuss webhook did.
 *
 * NOTE: the body shape below is a guess (no webhook docs yet). It looks for our request_id
 * in a few likely places. Check the first real webhook in your logs and tighten it.
 */
@Controller('webhooks/yangaplug')
export class YangaplugWebhookController {
  private readonly logger = new Logger(YangaplugWebhookController.name);

  constructor(private settlement: SettlementService) {}

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

    const reference = this.extractReference(body);
    if (!reference) {
      // log only the shape (field names), not the content
      this.logger.warn(
        `Yangaplug webhook without a request_id. Keys: ${Object.keys(body ?? {}).join(',')} | data keys: ${Object.keys(body?.data ?? {}).join(',')}`,
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
}