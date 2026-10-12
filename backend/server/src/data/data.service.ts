import { BadRequestException, Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import * as crypto from 'crypto';
import type { Transaction } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { PinService } from 'src/pin/pin.service';
import { SabussService, SabussReply, outcomeFromCode } from 'src/sabuss/sabuss.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { PurchaseDataDto } from './dto/purchase-data.dto';
import { sellingPrice } from './pricing';

const MESSAGES: Record<string, string> = {
  PENDING: 'Your data order is being processed. The final status will show shortly.',
  SUCCESS: 'Data purchase successful.',
  FAILED: 'The purchase failed and your wallet has been refunded.',
  REVERSED: 'The purchase was reversed and your wallet has been refunded.',
};

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  constructor(
    private prisma: PrismaService,
    private pinService: PinService,
    private sabuss: SabussService,
    private transactions: TransactionsService,
  ) {}

  /** Plans the user can buy. Prices are computed on the server. */
  async listPlans(network?: string) {
    const plans = await this.prisma.service.findMany({
      where: {
        provider: 'SABUSS',
        isActive: true,
        costPrice: { gt: 0 },
        ...(network ? { network: network.toUpperCase() } : {}),
      },
    });
    return plans
      .map((p) => ({
        id: p.id,
        name: p.name,
        network: p.network,
        validity: p.validity,
        price: sellingPrice(p.costPrice),
      }))
      .sort((a, b) => a.price - b.price);
  }

  async purchase(userId: number, dto: PurchaseDataDto) {
    // 1. the user proves it's them (locks after too many wrong tries)
    await this.pinService.verify(userId, dto.pin);

    // 2. same attempt sent twice (double tap, retry) -> return the first result
    const key = `data:${userId}:${dto.idempotencyKey}`;
    const existing = await this.prisma.transaction.findUnique({ where: { idempotencyKey: key } });
    if (existing) return this.view(existing);

    // 3. the plan and its price come from OUR database, never from the client
    const plan = await this.prisma.service.findFirst({
      where: { id: dto.planId, provider: 'SABUSS', isActive: true },
    });
    if (!plan || plan.costPrice <= 0) throw new BadRequestException('This plan is not available');
    const price = sellingPrice(plan.costPrice);

    // 4. is our Sabuss wallet able to pay for it? (null = couldn't read it, so don't block)
    const providerBalance = await this.sabuss.getBalance().catch(() => null);
    if (providerBalance !== null && providerBalance < plan.costPrice) {
      this.logger.error(`Sabuss wallet too low (${providerBalance}) for plan ${plan.code}. Top it up.`);
      throw new ServiceUnavailableException('Data purchase is temporarily unavailable. Please try again later.');
    }

    // 5. take the money and record the order in ONE database transaction.
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
            type: 'DATA',
            provider: 'SABUSS',
            providerRef: reference,
            idempotencyKey: key,
            status: 'PENDING',
            description: `${plan.name} for ${dto.phone}`,
            itemsPurchased: plan.name,
            dayPurchased: new Date(),
            itemsTime: new Date(),
            meta: {
              phone: dto.phone,
              servicePlanId: plan.id,
              sabussPlanId: plan.code,
              network: plan.network,
              costPrice: plan.costPrice,
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

    // 6. ask Sabuss. If we get no answer at all (timeout etc.) we do NOT refund:
    //    the order may still have gone through. It stays PENDING and gets resolved
    //    by the webhook / reconciliation job.
    let reply: SabussReply | null = null;
    try {
      reply = await this.sabuss.buyData({ planId: plan.code, phone: dto.phone, reference });
    } catch (err: any) {
      this.logger.warn(`No answer from Sabuss for ${reference}: ${err?.message}`);
    }

    if (reply) {
      const outcome = outcomeFromCode(reply.code);
      if (outcome === 'SUCCESS' || outcome === 'FAILED' || outcome === 'REVERSED') {
        await this.transactions.settle(reference, outcome);
      } else if (outcome === null) {
        this.logger.warn(`Unrecognised Sabuss reply for ${reference}: code=${reply.code} response=${reply.response}`);
      }
      // outcome === 'PENDING' (400): normal, the webhook will finish it
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
      plan: t.itemsPurchased,
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