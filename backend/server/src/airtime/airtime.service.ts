import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import type { Transaction } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { PinService } from 'src/pin/pin.service';
import { YangaplugService, YangaplugReply } from 'src/yangaplug/yangaplug.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { PurchaseAirtimeDto } from './dto/purchase-airtime.dto';

const MESSAGES: Record<string, string> = {
  PENDING: 'Your airtime order is being processed. The final status will show shortly.',
  SUCCESS: 'Airtime purchase successful.',
  FAILED: 'The purchase failed and your wallet has been refunded.',
  REVERSED: 'The purchase was reversed and your wallet has been refunded.',
};

const LABELS: Record<string, string> = { MTN: 'MTN', GLO: 'Glo', AIRTEL: 'Airtel', '9MOBILE': '9mobile' };

@Injectable()
export class AirtimeService {
  private readonly logger = new Logger(AirtimeService.name);

  constructor(
    private prisma: PrismaService,
    private pinService: PinService,
    private yangaplug: YangaplugService,
    private transactions: TransactionsService,
  ) {}

  async purchase(userId: number, dto: PurchaseAirtimeDto) {
    // 1. the user proves it's them (locks after too many wrong tries)
    await this.pinService.verify(userId, dto.pin);

    // 2. same attempt sent twice (double tap, retry) -> return the first result
    const key = `airtime:${userId}:${dto.idempotencyKey}`;
    const existing = await this.prisma.transaction.findUnique({ where: { idempotencyKey: key } });
    if (existing) return this.view(existing);

    // 3. the biller and its limits come from Yangaplug (cached), never from the client.
    //    Airtime billers look like "mtn_airtime", "glo_airtime", "airtel_airtime", "9mobile_airtime".
    const billerCode = `${dto.network.toLowerCase()}_airtime`;
    const label = LABELS[dto.network] ?? dto.network;
    const biller = await this.yangaplug
      .getBillers('airtime')
      .then((list) => list.find((b) => b.code === billerCode))
      .catch(() => undefined); // can't read the list: our own DTO limits still apply
    if (biller && !biller.isActive) {
      throw new BadRequestException(`${label} airtime is temporarily unavailable`);
    }
    if (biller?.minimum != null && dto.amount < biller.minimum) {
      throw new BadRequestException(`Minimum ${label} airtime is ₦${biller.minimum}`);
    }
    if (biller?.maximum != null && dto.amount > biller.maximum) {
      throw new BadRequestException(`Maximum ${label} airtime is ₦${biller.maximum}`);
    }

    // The customer pays the face value of the airtime. You earn whatever commission Yangaplug gives you.
    const price = dto.amount;

    // 4. take the money and record the order in ONE database transaction.
    //    The balance >= price condition is what stops two parallel requests overdrawing.
    const reference = this.newReference();
    let order: Transaction;
    try {
      order = await this.prisma.$transaction(async (db) => {
        const debit = await db.totalUser.updateMany({
          where: { id: userId, balance: { gte: price } },
          data: { balance: { decrement: price } },
        });
        if (debit.count === 0) throw new BadRequestException('Insufficient wallet balance');

        return db.transaction.create({
          data: {
            amount: price,
            type: 'AIRTIME',
            provider: 'YANGAPLUG',
            providerRef: reference,
            idempotencyKey: key,
            status: 'PENDING',
            description: `${label} airtime ₦${dto.amount} for ${dto.phone}`,
            itemsPurchased: `${label} airtime ₦${dto.amount}`,
            dayPurchased: new Date(),
            itemsTime: new Date(),
            meta: {
              phone: dto.phone,
              network: dto.network,
              billerCode,
              faceValue: dto.amount,
            },
            userId,
          },
        });
      });
    } catch (err: any) {
      if (err?.code === 'P2002') {
        // two identical requests raced; the unique key caught the second one
        const dup = await this.prisma.transaction.findUnique({ where: { idempotencyKey: key } });
        if (dup) return this.view(dup);
      }
      throw err;
    }

    // 5. ask Yangaplug. buyAirtime() never throws for provider/network trouble: a timeout or 5xx
    //    comes back as PENDING (we do NOT refund, the order may still have gone through) and is
    //    resolved by the webhook / reconciliation job. Only a clear 4xx rejection is FAILED.
    let reply: YangaplugReply | null = null;
    try {
      reply = await this.yangaplug.buyAirtime({
        billerCode,
        phone: dto.phone,
        amount: dto.amount,
        reference,
      });
    } catch (err: any) {
      this.logger.warn(`Yangaplug call crashed for ${reference}: ${err?.message}`);
    }

    if (reply) {
      if (reply.outcome === 'FAILED') {
        this.logger.error(`Yangaplug rejected airtime ${reference}: HTTP ${reply.httpStatus} ${reply.message}`);
      }
      if (reply.outcome === 'SUCCESS' || reply.outcome === 'FAILED') {
        await this.transactions.settle(reference, reply.outcome);
      }
      // outcome === 'PENDING': normal, the webhook / reconciliation will finish it
    }

    const latest = await this.prisma.transaction.findUnique({ where: { id: order.id } });
    return this.view(latest ?? order);
  }

  private view(t: Transaction) {
    return {
      id: t.id,
      reference: t.providerRef,
      status: t.status,
      amount: t.amount,
      item: t.itemsPurchased,
      phone: (t.meta as any)?.phone ?? null,
      message: MESSAGES[t.status] ?? '',
    };
  }

  private newReference(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const ts = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}`;
    return `${ts}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }
}