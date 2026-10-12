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
 * Set this URL in your Sabuss profile:
 *   https://<your-backend-domain>/webhooks/sabuss/<SABUSS_WEBHOOK_TOKEN>
 *
 * Sabuss webhooks carry no signature, so the body is only a hint about WHICH
 * order changed. The real outcome always comes from asking Sabuss (query).
 */
@Controller('webhooks/sabuss')
export class SabussWebhookController {
  private readonly logger = new Logger(SabussWebhookController.name);

  constructor(private settlement: SettlementService) {}

  private tokenOk(token: string): boolean {
    const expected = process.env.SABUSS_WEBHOOK_TOKEN;
    if (!expected) return false;
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }

  @Post(':token')
  @HttpCode(200)
  async handle(@Param('token') token: string, @Body() body: any) {
    if (!this.tokenOk(token)) throw new NotFoundException(); // look like the route doesn't exist

    const reference = body?.reference ? String(body.reference) : null;
    if (!reference) return { ok: true };

    try {
      await this.settlement.reconcile(reference);
    } catch (err: any) {
      // 500 so Sabuss may retry; the reconciliation job also covers this
      this.logger.error(`Webhook for ${reference} failed: ${err?.message}`);
      throw new InternalServerErrorException();
    }
    return { ok: true };
  }
}