// import {
//   BadRequestException,
//   HttpException,
//   HttpStatus,
//   Injectable,
//   Logger,
//   NotFoundException,
// } from '@nestjs/common';
// import * as crypto from 'crypto';
// import type { Transaction } from '@prisma/client';
// import { PrismaService } from 'src/prisma.service';
// import { PinService } from 'src/pin/pin.service';
// import { normalizeNgPhone, phoneVariants } from './phone.util';
// import { SendWalletDto } from './dto/transfer.dto';

// const num = (v: string | undefined, fallback: number) => {
//   const n = Number(v);
//   return Number.isFinite(n) && n > 0 ? n : fallback;
// };
// // change these with environment variables, no code edit needed.
// // The page shows a minimum of 100, so keep TRANSFER_MIN in step with MIN_AMOUNT there.
// const minAmount = () => num(process.env.TRANSFER_MIN, 10);
// const maxPerTransfer = () => num(process.env.TRANSFER_MAX, 200_000);
// const dailyLimit = () => num(process.env.TRANSFER_DAILY_LIMIT, 500_000);

// const round2 = (n: number) => Math.round(n * 100) / 100;
// const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

// @Injectable()
// export class TransfersService {
//   private readonly logger = new Logger(TransfersService.name);
//   private lookups = new Map<number, number[]>();

//   constructor(private prisma: PrismaService, private pinService: PinService) {}

//   // ---------- step 1: who am I sending to? ----------
//   async resolveWallet(senderId: number, identifier: string) {
//     // a badly typed number is rejected BEFORE it counts toward the rate limit
//     if (!normalizeNgPhone(identifier)) throw new BadRequestException('Enter a valid Nigerian phone number');
//     this.checkLookupRate(senderId);
//     const r = await this.findRecipient(senderId, identifier);
//     return { accountName: r.name };
//   }

//   // ---------- step 2: send ----------
//   async sendToWallet(senderId: number, dto: SendWalletDto) {
//     // 1. the user proves it's them (locks after too many wrong tries)
//     await this.pinService.verify(senderId, dto.pin);

//     // 2. same attempt sent twice -> return the first result
//     const key = `p2p:${senderId}:${dto.idempotencyKey}`;
//     const existing = await this.prisma.transaction.findUnique({ where: { idempotencyKey: key } });
//     if (existing) return this.view(existing, await this.balanceOf(senderId));

//     // 3. amount rules
//     const amount = round2(dto.amount);
//     if (amount < minAmount()) throw new BadRequestException(`Minimum transfer is ${naira(minAmount())}`);
//     if (amount > maxPerTransfer()) throw new BadRequestException(`Maximum per transfer is ${naira(maxPerTransfer())}`);

//     // 4. who gets it (never trust an id from the client, only the phone number)
//     const recipient = await this.findRecipient(senderId, dto.identifier);
//     const sender = await this.prisma.totalUser.findUnique({
//       where: { id: senderId },
//       select: { firstName: true, lastName: true },
//     });
//     if (!sender) throw new BadRequestException('User not found');
//     const senderName = `${sender.firstName} ${sender.lastName}`.trim();

//     const reference = this.newReference();
//     const now = new Date();
//     let result: { row: Transaction; balance: number };

//     try {
//       result = await this.prisma.$transaction(async (db) => {
//         // lock both wallets in id order so two people paying each other can't deadlock.
//         // The sender row stays locked until we finish, so the daily-limit check below is race-safe.
//         const [a, b] = [senderId, recipient.id].sort((x, y) => x - y);
//         await db.$queryRaw`SELECT "id" FROM "TotalUser" WHERE "id" IN (${a}, ${b}) ORDER BY "id" FOR UPDATE`;

//         // daily limit over the last 24 hours (bank transfers count too)
//         const used = await db.transaction.aggregate({
//           _sum: { amount: true },
//           where: {
//             userId: senderId,
//             type: { in: ['TRANSFER_SENT', 'TRANSFER_BANK'] },
//             status: { in: ['PENDING', 'SUCCESS'] },
//             createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
//           },
//         });
//         if ((used._sum.amount ?? 0) + amount > dailyLimit()) {
//           throw new BadRequestException(`You have reached your daily transfer limit of ${naira(dailyLimit())}`);
//         }

//         // take the money: balance >= amount is what stops overspending
//         const debit = await db.totalUser.updateMany({
//           where: { id: senderId, balance: { gte: amount } },
//           data: { balance: { decrement: amount } },
//         });
//         if (debit.count === 0) throw new BadRequestException('Insufficient wallet balance');

//         // give the money (the recipient must still exist and not be deleted)
//         const credit = await db.totalUser.updateMany({
//           where: { id: recipient.id, deletedAt: null },
//           data: { balance: { increment: amount } },
//         });
//         if (credit.count === 0) throw new BadRequestException('This recipient can no longer receive money');

//         const sentRow = await db.transaction.create({
//           data: {
//             amount,
//             type: 'TRANSFER_SENT',
//             provider: 'INTERNAL',
//             providerRef: reference,
//             idempotencyKey: key,
//             status: 'SUCCESS',
//             description: `Transfer to ${recipient.name}`,
//             itemsPurchased: 'Transfer to Sollnis user',
//             dayPurchased: now,
//             itemsTime: now,
//             meta: { recipientName: recipient.name, narration: dto.narration ?? null },
//             userId: senderId,
//           },
//         });

//         await db.transaction.create({
//           data: {
//             amount,
//             type: 'TRANSFER_RECEIVED',
//             provider: 'INTERNAL',
//             providerRef: reference,
//             idempotencyKey: `${key}:in`,
//             status: 'SUCCESS',
//             description: `Received from ${senderName}`,
//             itemsPurchased: 'Transfer received',
//             dayPurchased: now,
//             itemsTime: now,
//             meta: { senderName, narration: dto.narration ?? null },
//             userId: recipient.id,
//           },
//         });

//         const after = await db.totalUser.findUnique({ where: { id: senderId }, select: { balance: true } });
//         return { row: sentRow, balance: after?.balance ?? 0 };
//       });
//     } catch (err: any) {
//       if (err?.code === 'P2002') {
//         // two identical requests raced; the unique key caught the second one
//         const dup = await this.prisma.transaction.findUnique({ where: { idempotencyKey: key } });
//         if (dup) return this.view(dup, await this.balanceOf(senderId));
//       }
//       throw err;
//     }

//     return this.view(result.row, result.balance);
//   }

//   // ---------- helpers ----------
//   private async findRecipient(senderId: number, identifier: string) {
//     const local = normalizeNgPhone(identifier);
//     if (!local) throw new BadRequestException('Enter a valid Nigerian phone number');

//     const matches = await this.prisma.totalUser.findMany({
//       where: { phoneNumber: { in: phoneVariants(local) }, deletedAt: null },
//       select: { id: true, firstName: true, lastName: true },
//       take: 2,
//     });
//     if (matches.length === 0) throw new NotFoundException('No Sollnis account found for this number');
//     if (matches.length > 1) {
//       // two accounts share a number: refuse rather than guess who gets the money
//       this.logger.error(`Duplicate phone number in TotalUser: ${local}`);
//       throw new BadRequestException('This number cannot be used right now. Please contact support.');
//     }

//     const r = matches[0];
//     if (r.id === senderId) throw new BadRequestException("You can't send money to yourself");
//     return { id: r.id, name: `${r.firstName} ${r.lastName}`.trim() };
//   }

//   // 20 lookups per minute per user, so the lookup can't be used to scan for accounts
//   private checkLookupRate(userId: number) {
//     const now = Date.now();
//     const recent = (this.lookups.get(userId) ?? []).filter((t) => now - t < 60_000);
//     if (recent.length >= 20) {
//       throw new HttpException('Too many lookups. Please wait a minute.', HttpStatus.TOO_MANY_REQUESTS);
//     }
//     recent.push(now);
//     this.lookups.set(userId, recent);
//   }

//   private async balanceOf(userId: number): Promise<number> {
//     const u = await this.prisma.totalUser.findUnique({ where: { id: userId }, select: { balance: true } });
//     return u?.balance ?? 0;
//   }

//   private view(t: Transaction, balance: number) {
//     return {
//       id: t.id,
//       reference: t.providerRef,
//       status: t.status,
//       amount: t.amount,
//       accountName: (t.meta as any)?.recipientName ?? null,
//       balance,
//       message: t.status === 'SUCCESS' ? 'Transfer successful.' : '',
//     };
//   }

//   private newReference(): string {
//     const d = new Date();
//     const pad = (n: number) => String(n).padStart(2, '0');
//     const ts = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}`;
//     return `TRF${ts}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
//   }
// }







import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import type { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { PinService } from 'src/pin/pin.service';
import { PaystackRejected, PaystackTransferService } from 'src/paystack/paystack-transfer.service';
import { TransferSettlementService } from './transfer-settlement.service';
import { normalizeNgPhone, phoneVariants } from './phone.util';
import { ResolveBankDto, SendBankDto, SendWalletDto } from './dto/transfer.dto';

const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};
// change these with environment variables, no code edit needed.
// The page shows a minimum of 100, so keep TRANSFER_MIN in step with MIN_AMOUNT there.
const minAmount = () => num(process.env.TRANSFER_MIN, 10);
const maxPerTransfer = () => num(process.env.TRANSFER_MAX, 200_000);
const dailyLimit = () => num(process.env.TRANSFER_DAILY_LIMIT, 500_000);

/**
 * What you charge for a bank transfer. The page has the SAME tiers in getBankFee()
 * (display only). If you change one, change the other. Confirm Paystack's current
 * payout fees on their pricing page: you pay them on every transfer.
 */
export const bankFee = (amount: number) => (amount <= 5000 ? 10 : amount <= 50_000 ? 25 : 50);

const round2 = (n: number) => Math.round(n * 100) / 100;
const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

@Injectable()
export class TransfersService {
  private readonly logger = new Logger(TransfersService.name);
  private lookups = new Map<number, number[]>();

  constructor(
    private prisma: PrismaService,
    private pinService: PinService,
    private paystack: PaystackTransferService,
    private settlement: TransferSettlementService,
  ) {}

  // =====================================================================
  //  SOLLNIS WALLET
  // =====================================================================

  // ---------- step 1: who am I sending to? ----------
  async resolveWallet(senderId: number, identifier: string) {
    // a badly typed number is rejected BEFORE it counts toward the rate limit
    if (!normalizeNgPhone(identifier)) throw new BadRequestException('Enter a valid Nigerian phone number');
    this.checkLookupRate(senderId);
    const r = await this.findRecipient(senderId, identifier);
    return { accountName: r.name };
  }

  // ---------- step 2: send ----------
  async sendToWallet(senderId: number, dto: SendWalletDto) {
    // 1. the user proves it's them (locks after too many wrong tries)
    await this.pinService.verify(senderId, dto.pin);

    // 2. same attempt sent twice -> return the first result
    const key = `p2p:${senderId}:${dto.idempotencyKey}`;
    const existing = await this.prisma.transaction.findUnique({ where: { idempotencyKey: key } });
    if (existing) return this.walletView(existing, await this.balanceOf(senderId));

    // 3. amount rules
    const amount = round2(dto.amount);
    this.assertAmountAllowed(amount);

    // 4. who gets it (never trust an id from the client, only the phone number)
    const recipient = await this.findRecipient(senderId, dto.identifier);
    const sender = await this.prisma.totalUser.findUnique({
      where: { id: senderId },
      select: { firstName: true, lastName: true },
    });
    if (!sender) throw new BadRequestException('User not found');
    const senderName = `${sender.firstName} ${sender.lastName}`.trim();

    const reference = this.newReference();
    const now = new Date();
    let result: { row: Transaction; balance: number };

    try {
      result = await this.prisma.$transaction(async (db) => {
        // lock both wallets in id order so two people paying each other can't deadlock.
        // The sender row stays locked until we finish, so the daily-limit check below is race-safe.
        const [a, b] = [senderId, recipient.id].sort((x, y) => x - y);
        await db.$queryRaw`SELECT "id" FROM "TotalUser" WHERE "id" IN (${a}, ${b}) ORDER BY "id" FOR UPDATE`;

        await this.assertWithinDailyLimit(db, senderId, amount);

        // take the money: balance >= amount is what stops overspending
        const debit = await db.totalUser.updateMany({
          where: { id: senderId, balance: { gte: amount } },
          data: { balance: { decrement: amount } },
        });
        if (debit.count === 0) throw new BadRequestException('Insufficient wallet balance');

        // give the money (the recipient must still exist and not be deleted)
        const credit = await db.totalUser.updateMany({
          where: { id: recipient.id, deletedAt: null },
          data: { balance: { increment: amount } },
        });
        if (credit.count === 0) throw new BadRequestException('This recipient can no longer receive money');

        const sentRow = await db.transaction.create({
          data: {
            amount,
            type: 'TRANSFER_SENT',
            provider: 'INTERNAL',
            providerRef: reference,
            idempotencyKey: key,
            status: 'SUCCESS',
            description: `Transfer to ${recipient.name}`,
            itemsPurchased: 'Transfer to Sollnis user',
            dayPurchased: now,
            itemsTime: now,
            meta: { recipientName: recipient.name, narration: dto.narration ?? null },
            userId: senderId,
          },
        });

        await db.transaction.create({
          data: {
            amount,
            type: 'TRANSFER_RECEIVED',
            provider: 'INTERNAL',
            providerRef: reference,
            idempotencyKey: `${key}:in`,
            status: 'SUCCESS',
            description: `Received from ${senderName}`,
            itemsPurchased: 'Transfer received',
            dayPurchased: now,
            itemsTime: now,
            meta: { senderName, narration: dto.narration ?? null },
            userId: recipient.id,
          },
        });

        const after = await db.totalUser.findUnique({ where: { id: senderId }, select: { balance: true } });
        return { row: sentRow, balance: after?.balance ?? 0 };
      });
    } catch (err: any) {
      if (err?.code === 'P2002') {
        // two identical requests raced; the unique key caught the second one
        const dup = await this.prisma.transaction.findUnique({ where: { idempotencyKey: key } });
        if (dup) return this.walletView(dup, await this.balanceOf(senderId));
      }
      throw err;
    }

    return this.walletView(result.row, result.balance);
  }

  // =====================================================================
  //  OTHER BANKS (via Paystack)
  // =====================================================================

  async listBanks() {
    try {
      return { banks: await this.paystack.listBanks() };
    } catch (err: any) {
      this.logger.warn(`Bank list failed: ${err?.message}`);
      throw new ServiceUnavailableException('Could not load banks. Please try again shortly.');
    }
  }

  // ---------- step 1: whose account is this? ----------
  async resolveBank(userId: number, dto: ResolveBankDto) {
    this.checkLookupRate(userId);
    try {
      return { accountName: await this.paystack.resolveAccount(dto.accountNumber, dto.bankCode) };
    } catch (err) {
      this.paystackFailure(err, 'Could not verify this account. Check the account number and bank.');
    }
  }

  // ---------- step 2: send ----------
  async sendToBank(userId: number, dto: SendBankDto) {
    // 1. the user proves it's them (locks after too many wrong tries)
    await this.pinService.verify(userId, dto.pin);

    // 2. same attempt sent twice -> return the first result
    const key = `bank:${userId}:${dto.idempotencyKey}`;
    const existing = await this.prisma.transaction.findUnique({ where: { idempotencyKey: key } });
    if (existing) return this.bankReplay(existing, userId);

    // 3. amount rules. The fee is worked out HERE, never taken from the page.
    const amount = round2(dto.amount);
    this.assertAmountAllowed(amount);
    const fee = bankFee(amount);
    const total = round2(amount + fee);

    // 4. ask Paystack for the real account name and a payout recipient.
    //    Nothing is debited yet, so a bad account costs the user nothing.
    let accountName: string;
    let recipientCode: string;
    try {
      accountName = await this.paystack.resolveAccount(dto.accountNumber, dto.bankCode);
      recipientCode = await this.paystack.createRecipient(accountName, dto.accountNumber, dto.bankCode);
    } catch (err) {
      this.paystackFailure(err, 'Could not verify this account. Check the account number and bank.');
    }

    // 5. do WE have the money to pay it out? (null = couldn't read it, so don't block)
    const float = await this.paystack.getBalance();
    if (float !== null && float < total) {
      this.logger.error(`Paystack balance too low (${float}) for a ${total} bank transfer. Top it up.`);
      throw new ServiceUnavailableException('Bank transfers are temporarily unavailable. Please try again later.');
    }

    // const bankName = (await this.paystack.listBanks().catch(() => [])).find((b) => b.code === dto.bankCode)?.name ?? null;
    const banks: { code: string; name: string }[] = await this.paystack
      .listBanks()
      .catch(() => []);
    const bankName = banks.find((b) => b.code === dto.bankCode)?.name ?? null;


    // 6. take the money and record the transfer in ONE database transaction.
    //    The balance >= total condition is what stops two parallel requests overdrawing.
    //    Paystack references must be lowercase letters, digits, - or _ (16-50 characters).
    const reference = `sp-${crypto.randomUUID()}`;
    const now = new Date();
    let order: Transaction;
    try {
      order = await this.prisma.$transaction(async (db) => {
        await db.$queryRaw`SELECT "id" FROM "TotalUser" WHERE "id" = ${userId} FOR UPDATE`;
        await this.assertWithinDailyLimit(db, userId, amount);

        const debit = await db.totalUser.updateMany({
          where: { id: userId, balance: { gte: total } },
          data: { balance: { decrement: total } },
        });
        if (debit.count === 0) throw new BadRequestException('Insufficient wallet balance');

        return db.transaction.create({
          data: {
            amount,
            type: 'TRANSFER_BANK',
            provider: 'PAYSTACK',
            providerRef: reference,
            idempotencyKey: key,
            status: 'PENDING',
            description: `Transfer to ${accountName}`,
            itemsPurchased: 'Transfer to bank account',
            dayPurchased: now,
            itemsTime: now,
            meta: {
              accountName,
              accountNumber: dto.accountNumber,
              bankCode: dto.bankCode,
              bankName,
              fee,
              narration: dto.narration ?? null,
            },
            userId,
          },
        });
      });
    } catch (err: any) {
      if (err?.code === 'P2002') {
        // two identical requests raced; the unique key caught the second one
        const dup = await this.prisma.transaction.findUnique({ where: { idempotencyKey: key } });
        if (dup) return this.bankReplay(dup, userId);
      }
      throw err;
    }

    // 7. ask Paystack to pay. If we get NO answer at all (timeout, 5xx) we do NOT refund:
    //    the transfer may still have gone through. It stays PENDING and gets resolved
    //    by the webhook / reconciliation job.
    let reply: Awaited<ReturnType<PaystackTransferService['initiateTransfer']>> | null = null;
    try {
      reply = await this.paystack.initiateTransfer({
        amountKobo: Math.round(amount * 100),
        recipientCode,
        reference,
        reason: dto.narration?.trim() || 'Sollnis Pay transfer',
      });
    } catch (err: any) {
      this.logger.warn(`No answer from Paystack for ${reference}: ${err?.message}`);
    }

    if (reply) {
      if (!reply.ok) {
        // Paystack clearly refused it (4xx): nothing will be paid, so give the money back
        this.logger.error(`Paystack rejected transfer ${reference}: ${reply.httpStatus} ${reply.message}`);
        await this.settlement.settle(reference, 'FAILED');
        throw new BadRequestException('This transfer could not be processed. You have not been charged.');
      }

      if (reply.transferCode) {
        await this.prisma.transaction.update({
          where: { id: order.id },
          data: { meta: { ...((order.meta as object) ?? {}), transferCode: reply.transferCode } },
        });
      }

      if (reply.status === 'success') {
        await this.settlement.settle(reference, 'SUCCESS');
      } else if (reply.status === 'failed' || reply.status === 'reversed') {
        await this.settlement.settle(reference, reply.status === 'failed' ? 'FAILED' : 'REVERSED');
        throw new BadRequestException('This transfer could not be completed. Your wallet has been refunded.');
      } else if (reply.status === 'otp') {
        // OTP is still switched on in Paystack, so the transfer is waiting for a code.
        // Kept PENDING (not refunded) because it could still be finalised. Fix the setting.
        this.logger.error(`Transfer ${reference} is waiting for an OTP: disable the transfer OTP in Paystack settings`);
      }
      // anything else (pending, received...): normal, the webhook will finish it
    }

    const latest = await this.prisma.transaction.findUnique({ where: { id: order.id } });
    return this.bankView(latest ?? order, await this.balanceOf(userId));
  }

  // =====================================================================
  //  helpers
  // =====================================================================

  private assertAmountAllowed(amount: number) {
    if (amount < minAmount()) throw new BadRequestException(`Minimum transfer is ${naira(minAmount())}`);
    if (amount > maxPerTransfer()) throw new BadRequestException(`Maximum per transfer is ${naira(maxPerTransfer())}`);
  }

  // last 24 hours; wallet and bank transfers both count. Call this AFTER locking the sender row.
  private async assertWithinDailyLimit(db: Prisma.TransactionClient, userId: number, amount: number) {
    const used = await db.transaction.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: { in: ['TRANSFER_SENT', 'TRANSFER_BANK'] },
        status: { in: ['PENDING', 'SUCCESS'] },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });
    if ((used._sum.amount ?? 0) + amount > dailyLimit()) {
      throw new BadRequestException(`You have reached your daily transfer limit of ${naira(dailyLimit())}`);
    }
  }

  private async findRecipient(senderId: number, identifier: string) {
    const local = normalizeNgPhone(identifier);
    if (!local) throw new BadRequestException('Enter a valid Nigerian phone number');

    const matches = await this.prisma.totalUser.findMany({
      where: { phoneNumber: { in: phoneVariants(local) }, deletedAt: null },
      select: { id: true, firstName: true, lastName: true },
      take: 2,
    });
    if (matches.length === 0) throw new NotFoundException('No Sollnis account found for this number');
    if (matches.length > 1) {
      // two accounts share a number: refuse rather than guess who gets the money
      this.logger.error(`Duplicate phone number in TotalUser: ${local}`);
      throw new BadRequestException('This number cannot be used right now. Please contact support.');
    }

    const r = matches[0];
    if (r.id === senderId) throw new BadRequestException("You can't send money to yourself");
    return { id: r.id, name: `${r.firstName} ${r.lastName}`.trim() };
  }

  // 20 lookups per minute per user, so lookups can't be used to scan for accounts
  private checkLookupRate(userId: number) {
    const now = Date.now();
    const recent = (this.lookups.get(userId) ?? []).filter((t) => now - t < 60_000);
    if (recent.length >= 20) {
      throw new HttpException('Too many lookups. Please wait a minute.', HttpStatus.TOO_MANY_REQUESTS);
    }
    recent.push(now);
    this.lookups.set(userId, recent);
  }

  private paystackFailure(err: unknown, rejectedMessage: string): never {
    if (err instanceof PaystackRejected) throw new BadRequestException(rejectedMessage);
    this.logger.warn(`Paystack unavailable: ${(err as any)?.message}`);
    throw new ServiceUnavailableException('Bank transfers are temporarily unavailable. Please try again shortly.');
  }

  private async balanceOf(userId: number): Promise<number> {
    const u = await this.prisma.totalUser.findUnique({ where: { id: userId }, select: { balance: true } });
    return u?.balance ?? 0;
  }

  // The page treats anything that isn't PENDING as "successful", so a FAILED/REVERSED
  // transfer is never returned as a normal result: it is thrown as an error instead.
  private bankReplay(t: Transaction, userId: number) {
    if (t.status === 'FAILED' || t.status === 'REVERSED') {
      throw new BadRequestException('This transfer failed and your wallet has been refunded. Please start a new transfer.');
    }
    return this.balanceOf(userId).then((balance) => this.bankView(t, balance));
  }

  private walletView(t: Transaction, balance: number) {
    return {
      id: t.id,
      reference: t.providerRef,
      status: t.status,
      amount: t.amount,
      accountName: (t.meta as any)?.recipientName ?? null,
      balance,
      message: t.status === 'SUCCESS' ? 'Transfer successful.' : '',
    };
  }

  private bankView(t: Transaction, balance: number) {
    return {
      id: t.id,
      reference: t.providerRef,
      status: t.status,
      amount: t.amount,
      accountName: (t.meta as any)?.accountName ?? null,
      balance,
      message:
        t.status === 'SUCCESS'
          ? 'Transfer successful.'
          : 'Your bank transfer is being processed. The final status will show shortly.',
    };
  }

  private newReference(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const ts = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}`;
    return `TRF${ts}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }
}