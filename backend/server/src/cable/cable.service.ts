// import {
//   BadRequestException,
//   Injectable,
//   Logger,
//   ServiceUnavailableException,
// } from '@nestjs/common';
// import * as crypto from 'crypto';
// import type { Transaction } from '@prisma/client';
// import { PrismaService } from 'src/prisma.service';
// import { PinService } from 'src/pin/pin.service';
// import { YangaplugService, YangaplugReply, YangaplugBiller } from 'src/yangaplug/yangaplug.service';
// import { TransactionsService } from 'src/transactions/transactions.service';
// import { PurchaseCableDto } from './dto/purchase-cable.dto';
// import { VerifyCableDto } from './dto/verify-cable.dto';

// const MESSAGES: Record<string, string> = {
//   PENDING: 'Your subscription is being processed. The final status will show shortly.',
//   SUCCESS: 'Cable TV subscription successful.',
//   FAILED: 'The purchase failed and your wallet has been refunded.',
//   REVERSED: 'The purchase was reversed and your wallet has been refunded.',
// };

// /** What the customer pays = Yangaplug's price + your flat fee (CABLE_SERVICE_FEE in naira, default 0). */
// function cablePrice(cost: number): number {
//   const fee = Number(process.env.CABLE_SERVICE_FEE ?? 0);
//   return Math.ceil(cost + (Number.isFinite(fee) && fee > 0 ? fee : 0));
// }

// @Injectable()
// export class CableService {
//   private readonly logger = new Logger(CableService.name);

//   constructor(
//     private prisma: PrismaService,
//     private pinService: PinService,
//     private yangaplug: YangaplugService,
//     private transactions: TransactionsService,
//   ) {}

//   // ---------- reading (no money moves) ----------

//   private async activeBillers(): Promise<YangaplugBiller[]> {
//     try {
//       const list = await this.yangaplug.getBillers('cable_tv');
//       return list.filter((b) => b.isActive && b.hasProducts);
//     } catch (err: any) {
//       this.logger.warn(`Could not load cable billers: ${err?.message}`);
//       throw new ServiceUnavailableException('Cable TV is temporarily unavailable. Please try again later.');
//     }
//   }

//   private async findProvider(code: string): Promise<YangaplugBiller> {
//     const biller = (await this.activeBillers()).find((b) => b.code === code);
//     if (!biller) throw new BadRequestException('Choose a valid cable TV provider');
//     return biller;
//   }

//   /** The cable TV providers (DSTV, GOtv...) the customer can pick from. */
//   async providers() {
//     const list = await this.activeBillers();
//     return list.map((b) => ({ code: b.code, name: b.name, imageUrl: b.imageUrl, needsPhone: b.requiresPhoneNo }));
//   }

//   /** Plans for one provider. Prices are computed on the server. */
//   async plans(provider: string) {
//     await this.findProvider(provider);
//     let plans;
//     try {
//       plans = await this.yangaplug.getPlans(provider);
//     } catch (err: any) {
//       this.logger.warn(`Could not load cable plans for ${provider}: ${err?.message}`);
//       throw new ServiceUnavailableException('Cable TV plans are temporarily unavailable. Please try again later.');
//     }
//     return plans
//       .map((p) => ({ id: p.planId, name: p.name, price: cablePrice(p.amount) }))
//       .sort((a, b) => a.price - b.price);
//   }

//   /** "Is this you?" step: who owns this smartcard / IUC number. */
//   async verify(dto: VerifyCableDto) {
//     const biller = await this.findProvider(dto.provider);
//     if (!biller.isResolvable) return { verified: false, customerName: null };

//     try {
//       const res = await this.yangaplug.validateCustomer(dto.provider, dto.smartcard);
//       if (!res.valid) {
//         throw new BadRequestException('We could not find an account for that smartcard / IUC number.');
//       }
//       return { verified: true, customerName: res.customerName };
//     } catch (err: any) {
//       if (err instanceof BadRequestException) throw err;
//       this.logger.warn(`Customer check failed: ${err?.message}`);
//       throw new ServiceUnavailableException('We could not check that number right now. Please try again.');
//     }
//   }

//   // ---------- buying ----------

//   async purchase(userId: number, dto: PurchaseCableDto) {
//     // 1. the user proves it's them (locks after too many wrong tries)
//     await this.pinService.verify(userId, dto.pin);

//     // 2. same attempt sent twice (double tap, retry) -> return the first result
//     const key = `cable:${userId}:${dto.idempotencyKey}`;
//     const existing = await this.prisma.transaction.findUnique({ where: { idempotencyKey: key } });
//     if (existing) return this.view(existing);

//     // 3. provider and plan come from Yangaplug, never from the client. The price is worked out here.
//     const biller = await this.findProvider(dto.provider);
//     if (!dto.planId.startsWith(`${dto.provider}:`)) throw new BadRequestException('This plan is not available');
//     const productCode = dto.planId.slice(dto.provider.length + 1);

//     let plan;
//     try {
//       plan = (await this.yangaplug.getPlans(dto.provider)).find((p) => p.planId === dto.planId);
//     } catch {
//       throw new ServiceUnavailableException('Cable TV is temporarily unavailable. Please try again later.');
//     }
//     if (!plan || !productCode) throw new BadRequestException('This plan is not available');
//     const price = cablePrice(plan.amount);

//     if (biller.requiresPhoneNo && !dto.phone) {
//       throw new BadRequestException('A phone number is required for this provider');
//     }

//     // 4. check the smartcard again on the server. A wrong number is not recoverable, so we don't sell
//     //    if we can't confirm it (when the provider supports checking).
//     let customerName: string | null = null;
//     if (biller.isResolvable) {
//       try {
//         const res = await this.yangaplug.validateCustomer(dto.provider, dto.smartcard);
//         if (!res.valid) throw new BadRequestException('We could not find an account for that smartcard / IUC number.');
//         customerName = res.customerName;
//       } catch (err: any) {
//         if (err instanceof BadRequestException) throw err;
//         this.logger.warn(`Customer check failed before purchase: ${err?.message}`);
//         throw new ServiceUnavailableException('We could not check that number right now. Please try again.');
//       }
//     }

//     // 5. take the money and record the order in ONE database transaction.
//     //    The balance >= price condition is what stops two parallel requests overdrawing.
//     const reference = this.newReference();
//     let order: Transaction;
//     try {
//       order = await this.prisma.$transaction(async (db) => {
//         const debit = await db.totalUser.updateMany({
//           where: { id: userId, balance: { gte: price } },
//           data: { balance: { decrement: price } },
//         });
//         if (debit.count === 0) throw new BadRequestException('Insufficient wallet balance');

//         return db.transaction.create({
//           data: {
//             amount: price,
//             type: 'CABLE',
//             provider: 'YANGAPLUG',
//             providerRef: reference,
//             idempotencyKey: key,
//             status: 'PENDING',
//             description: `${plan.name} for smartcard ${dto.smartcard}`,
//             itemsPurchased: plan.name,
//             dayPurchased: new Date(),
//             itemsTime: new Date(),
//             meta: {
//               provider: dto.provider,
//               planId: plan.planId,
//               smartcard: dto.smartcard,
//               customerName,
//               phone: dto.phone ?? null,
//               costPrice: plan.amount,
//             },
//             userId,
//           },
//         });
//       });
//     } catch (err: any) {
//       if (err?.code === 'P2002') {
//         // two identical requests raced; the unique key caught the second one
//         const dup = await this.prisma.transaction.findUnique({ where: { idempotencyKey: key } });
//         if (dup) return this.view(dup);
//       }
//       throw err;
//     }

//     // 6. ask Yangaplug. buyCableTv() never throws for provider/network trouble: a timeout or 5xx
//     //    comes back as PENDING (we do NOT refund, the order may still have gone through) and is
//     //    resolved by the webhook / reconciliation job. Only a clear 4xx rejection is FAILED.
//     let reply: YangaplugReply | null = null;
//     try {
//       reply = await this.yangaplug.buyCableTv({
//         billerCode: dto.provider,
//         productCode,
//         smartcard: dto.smartcard,
//         phone: biller.requiresPhoneNo ? dto.phone : undefined,
//         reference,
//       });
//     } catch (err: any) {
//       this.logger.warn(`Yangaplug call crashed for ${reference}: ${err?.message}`);
//     }

//     if (reply) {
//       if (reply.outcome === 'FAILED') {
//         this.logger.error(`Yangaplug rejected cable ${reference}: HTTP ${reply.httpStatus} ${reply.message}`);
//       }
//       if (reply.outcome === 'SUCCESS' || reply.outcome === 'FAILED') {
//         await this.transactions.settle(reference, reply.outcome);
//       }
//       // outcome === 'PENDING': normal, the webhook / reconciliation will finish it
//     }

//     const latest = await this.prisma.transaction.findUnique({ where: { id: order.id } });
//     return this.view(latest ?? order);
//   }

//   private view(t: Transaction) {
//     const meta = (t.meta as any) ?? {};
//     return {
//       id: t.id,
//       reference: t.providerRef,
//       status: t.status,
//       amount: t.amount,
//       plan: t.itemsPurchased,
//       smartcard: meta.smartcard ?? null,
//       customerName: meta.customerName ?? null,
//       message: MESSAGES[t.status] ?? '',
//     };
//   }

//   private newReference(): string {
//     const d = new Date();
//     const pad = (n: number) => String(n).padStart(2, '0');
//     const ts = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}`;
//     return `${ts}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
//   }
// }









import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import type { Transaction } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { PinService } from 'src/pin/pin.service';
import { YangaplugService, YangaplugReply, YangaplugBiller } from 'src/yangaplug/yangaplug.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { PurchaseCableDto } from './dto/purchase-cable.dto';
import { VerifyCableDto } from './dto/verify-cable.dto';

const MESSAGES: Record<string, string> = {
  PENDING: 'Your subscription is being processed. The final status will show shortly.',
  SUCCESS: 'Cable TV subscription successful.',
  FAILED: 'The purchase failed and your wallet has been refunded.',
  REVERSED: 'The purchase was reversed and your wallet has been refunded.',
};

/** What the customer pays = Yangaplug's price + your flat fee (CABLE_SERVICE_FEE in naira, default 0). */
function cablePrice(cost: number): number {
  const fee = Number(process.env.CABLE_SERVICE_FEE ?? 0);
  return Math.ceil(cost + (Number.isFinite(fee) && fee > 0 ? fee : 0));
}

@Injectable()
export class CableService {
  private readonly logger = new Logger(CableService.name);

  constructor(
    private prisma: PrismaService,
    private pinService: PinService,
    private yangaplug: YangaplugService,
    private transactions: TransactionsService,
  ) {}

  // ---------- reading (no money moves) ----------

  private async activeBillers(): Promise<YangaplugBiller[]> {
    try {
      const list = await this.yangaplug.getBillers('cable_tv');
      return list.filter((b) => b.isActive && b.hasProducts);
    } catch (err: any) {
      this.logger.warn(`Could not load cable billers: ${err?.message}`);
      throw new ServiceUnavailableException('Cable TV is temporarily unavailable. Please try again later.');
    }
  }

  private async findProvider(code: string): Promise<YangaplugBiller> {
    const biller = (await this.activeBillers()).find((b) => b.code === code);
    if (!biller) throw new BadRequestException('Choose a valid cable TV provider');
    return biller;
  }

  /** The cable TV providers (DSTV, GOtv...) the customer can pick from. */
  async providers() {
    const list = await this.activeBillers();
    return list.map((b) => ({ code: b.code, name: b.name, imageUrl: b.imageUrl, needsPhone: b.requiresPhoneNo }));
  }

  /** Plans for one provider. Prices are computed on the server. */
  async plans(provider: string) {
    await this.findProvider(provider);
    let plans;
    try {
      plans = await this.yangaplug.getPlans(provider);
    } catch (err: any) {
      this.logger.warn(`Could not load cable plans for ${provider}: ${err?.message}`);
      throw new ServiceUnavailableException('Cable TV plans are temporarily unavailable. Please try again later.');
    }
    return plans
      .map((p) => ({ id: p.planId, name: p.name, price: cablePrice(p.amount) }))
      .sort((a, b) => a.price - b.price);
  }

  /** "Is this you?" step: who owns this smartcard / IUC number. */
  async verify(dto: VerifyCableDto) {
    const biller = await this.findProvider(dto.provider);
    if (!biller.isResolvable) return { verified: false, customerName: null };

    try {
      const res = await this.yangaplug.validateCustomer(dto.provider, dto.smartcard);
      if (!res.valid) {
        throw new BadRequestException('We could not find an account for that smartcard / IUC number.');
      }
      return { verified: true, customerName: res.customerName };
    } catch (err: any) {
      if (err instanceof BadRequestException) throw err;
      this.logger.warn(`Customer check failed: ${err?.message}`);
      throw new ServiceUnavailableException('We could not check that number right now. Please try again.');
    }
  }

  // ---------- buying ----------

  async purchase(userId: number, dto: PurchaseCableDto) {
    // 1. the user proves it's them (locks after too many wrong tries)
    await this.pinService.verify(userId, dto.pin);

    // 2. same attempt sent twice (double tap, retry) -> return the first result
    const key = `cable:${userId}:${dto.idempotencyKey}`;
    const existing = await this.prisma.transaction.findUnique({ where: { idempotencyKey: key } });
    if (existing) return this.view(existing);

    // 3. provider and plan come from Yangaplug, never from the client. The price is worked out here.
    const biller = await this.findProvider(dto.provider);
    if (!dto.planId.startsWith(`${dto.provider}:`)) throw new BadRequestException('This plan is not available');
    const productCode = dto.planId.slice(dto.provider.length + 1);

    let plan;
    try {
      plan = (await this.yangaplug.getPlans(dto.provider)).find((p) => p.planId === dto.planId);
    } catch {
      throw new ServiceUnavailableException('Cable TV is temporarily unavailable. Please try again later.');
    }
    if (!plan || !productCode) throw new BadRequestException('This plan is not available');
    const price = cablePrice(plan.amount);

    if (biller.requiresPhoneNo && !dto.phone) {
      throw new BadRequestException('A phone number is required for this provider');
    }

    // 4. check the smartcard again on the server. A wrong number is not recoverable, so we don't sell
    //    if we can't confirm it (when the provider supports checking).
    let customerName: string | null = null;
    if (biller.isResolvable) {
      try {
        const res = await this.yangaplug.validateCustomer(dto.provider, dto.smartcard);
        if (!res.valid) throw new BadRequestException('We could not find an account for that smartcard / IUC number.');
        customerName = res.customerName;
      } catch (err: any) {
        if (err instanceof BadRequestException) throw err;
        this.logger.warn(`Customer check failed before purchase: ${err?.message}`);
        throw new ServiceUnavailableException('We could not check that number right now. Please try again.');
      }
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
            type: 'TV_SUBSCRIPTION',
            provider: 'YANGAPLUG',
            providerRef: reference,
            idempotencyKey: key,
            status: 'PENDING',
            description: `${plan.name} for smartcard ${dto.smartcard}`,
            itemsPurchased: plan.name,
            dayPurchased: new Date(),
            itemsTime: new Date(),
            meta: {
              provider: dto.provider,
              planId: plan.planId,
              smartcard: dto.smartcard,
              customerName,
              phone: dto.phone ?? null,
              costPrice: plan.amount,
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

    // 6. ask Yangaplug. buyCableTv() never throws for provider/network trouble: a timeout or 5xx
    //    comes back as PENDING (we do NOT refund, the order may still have gone through) and is
    //    resolved by the webhook / reconciliation job. Only a clear 4xx rejection is FAILED.
    let reply: YangaplugReply | null = null;
    try {
      reply = await this.yangaplug.buyCableTv({
        billerCode: dto.provider,
        productCode,
        smartcard: dto.smartcard,
        phone: biller.requiresPhoneNo ? dto.phone : undefined,
        reference,
      });
    } catch (err: any) {
      this.logger.warn(`Yangaplug call crashed for ${reference}: ${err?.message}`);
    }

    if (reply) {
      if (reply.outcome === 'FAILED') {
        this.logger.error(`Yangaplug rejected cable ${reference}: HTTP ${reply.httpStatus} ${reply.message}`);
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
    const meta = (t.meta as any) ?? {};
    return {
      id: t.id,
      reference: t.providerRef,
      status: t.status,
      amount: t.amount,
      plan: t.itemsPurchased,
      smartcard: meta.smartcard ?? null,
      customerName: meta.customerName ?? null,
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