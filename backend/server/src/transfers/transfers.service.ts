import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as crypto from 'crypto';
import type { Transaction } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { PinService } from 'src/pin/pin.service';
import { normalizeNgPhone, phoneVariants } from './phone.util';
import { SendWalletDto } from './dto/transfer.dto';

const num = (v: string | undefined, fallback: number) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};
// change these with environment variables, no code edit needed.
// The page shows a minimum of 100, so keep TRANSFER_MIN in step with MIN_AMOUNT there.
const minAmount = () => num(process.env.TRANSFER_MIN, 10);
const maxPerTransfer = () => num(process.env.TRANSFER_MAX, 200_000);
const dailyLimit = () => num(process.env.TRANSFER_DAILY_LIMIT, 500_000);

const round2 = (n: number) => Math.round(n * 100) / 100;
const naira = (n: number) => `₦${n.toLocaleString('en-NG')}`;

@Injectable()
export class TransfersService {
  private readonly logger = new Logger(TransfersService.name);
  private lookups = new Map<number, number[]>();

  constructor(private prisma: PrismaService, private pinService: PinService) {}

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
    if (existing) return this.view(existing, await this.balanceOf(senderId));

    // 3. amount rules
    const amount = round2(dto.amount);
    if (amount < minAmount()) throw new BadRequestException(`Minimum transfer is ${naira(minAmount())}`);
    if (amount > maxPerTransfer()) throw new BadRequestException(`Maximum per transfer is ${naira(maxPerTransfer())}`);

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

        // daily limit over the last 24 hours (bank transfers count too)
        const used = await db.transaction.aggregate({
          _sum: { amount: true },
          where: {
            userId: senderId,
            type: { in: ['TRANSFER_SENT', 'TRANSFER_BANK'] },
            status: { in: ['PENDING', 'SUCCESS'] },
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
          },
        });
        if ((used._sum.amount ?? 0) + amount > dailyLimit()) {
          throw new BadRequestException(`You have reached your daily transfer limit of ${naira(dailyLimit())}`);
        }

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
        if (dup) return this.view(dup, await this.balanceOf(senderId));
      }
      throw err;
    }

    return this.view(result.row, result.balance);
  }

  // ---------- helpers ----------
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

  // 20 lookups per minute per user, so the lookup can't be used to scan for accounts
  private checkLookupRate(userId: number) {
    const now = Date.now();
    const recent = (this.lookups.get(userId) ?? []).filter((t) => now - t < 60_000);
    if (recent.length >= 20) {
      throw new HttpException('Too many lookups. Please wait a minute.', HttpStatus.TOO_MANY_REQUESTS);
    }
    recent.push(now);
    this.lookups.set(userId, recent);
  }

  private async balanceOf(userId: number): Promise<number> {
    const u = await this.prisma.totalUser.findUnique({ where: { id: userId }, select: { balance: true } });
    return u?.balance ?? 0;
  }

  private view(t: Transaction, balance: number) {
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

  private newReference(): string {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const ts = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}`;
    return `TRF${ts}${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  }
}