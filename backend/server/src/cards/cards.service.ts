// import { BadRequestException, Injectable, ServiceUnavailableException } from '@nestjs/common';
// import { PrismaService } from 'src/prisma.service';
// import { YangaplugService } from 'src/yangaplug/yangaplug.service'; // adjust to where your file lives
// import { EnrollCardholderDto } from './dto/enroll-cardholder.dto';

// @Injectable()
// export class CardsService {
//   constructor(
//     private prisma: PrismaService,
//     private yangaplug: YangaplugService,
//   ) {}

//   private view(row: { status: string }) {
//     return { enrolled: true, status: row.status, kycVerified: row.status === 'VERIFIED' };
//   }

//   /** Name, email and phone come from the account, so the cardholder always matches the user. Only KYC comes from the form. */
//   async enroll(userId: number, dto: EnrollCardholderDto) {
//     const user = await this.prisma.totalUser.findUnique({
//       where: { id: userId },
//       select: { firstName: true, lastName: true, email: true, phoneNumber: true, deletedAt: true },
//     });
//     if (!user || user.deletedAt) throw new BadRequestException('User not found');

//     const existing = await this.prisma.cardholder.findUnique({ where: { userId } });
//     if (existing) return this.view(existing);

//     // A earlier attempt may have created the cardholder on Yangaplug and then timed out: adopt it instead of duplicating.
//     let remote;
//     try {
//       remote = await this.yangaplug.findCardholderByEmail(user.email);
//     } catch {
//       throw new ServiceUnavailableException('Card service is unavailable. Please try again shortly.');
//     }

//     if (!remote) {
//       let res;
//       try {
//         res = await this.yangaplug.enrollCardholder({
//           firstName: user.firstName,
//           lastName: user.lastName,
//           email: user.email,
//           phone: user.phoneNumber,
//           kyc: {
//             bvn: dto.bvn,
//             dob: dto.dob,
//             id_type: dto.id_type,
//             id_number: dto.id_number,
//             id_image: dto.id_image,
//             address_line_1: dto.address_line_1,
//             city: dto.city,
//             state: dto.state,
//             country: dto.country.toUpperCase(),
//             postal_code: dto.postal_code,
//             selfie_image: dto.selfie_image,
//           },
//         });
//       } catch {
//         throw new ServiceUnavailableException('Card service is unavailable. Please try again shortly.');
//       }
//       if (!res.ok) {
//         throw new BadRequestException('We could not verify your details. Check your BVN, ID and address and try again.');
//       }
//       remote = res.cardholder;
//     }

//     const row = await this.prisma.cardholder.upsert({
//       where: { userId },
//       create: { userId, yangaplugId: remote.id, status: remote.kycVerified ? 'VERIFIED' : 'PENDING_KYC' },
//       update: {},
//     });
//     return this.view(row);
//   }

//   /** Current enrollment state. While not verified, re-checks Yangaplug (read-only, so a failed check just returns the stored state). */
//   async getMine(userId: number) {
//     const row = await this.prisma.cardholder.findUnique({ where: { userId } });
//     if (!row) return { enrolled: false, status: null, kycVerified: false };

//     if (row.status !== 'VERIFIED') {
//       try {
//         const user = await this.prisma.totalUser.findUnique({ where: { id: userId }, select: { email: true } });
//         const remote = user ? await this.yangaplug.findCardholderByEmail(user.email) : null;
//         if (remote?.kycVerified) {
//           const updated = await this.prisma.cardholder.update({ where: { userId }, data: { status: 'VERIFIED' } });
//           return this.view(updated);
//         }
//       } catch {
//         // keep the stored state
//       }
//     }
//     return this.view(row);
//   }
// }





import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { YangaplugService } from 'src/yangaplug/yangaplug.service'; // ADJUST
import { PinService } from 'src/pin/pin.service'; // ADJUST
import { TransactionsService } from 'src/transactions/transactions.service'; // ADJUST
import { EnrollCardholderDto } from './dto/enroll-cardholder.dto';
import { CreateCardDto } from './dto/create-card.dto';
import { FundCardDto } from './dto/fund-card.dto';

@Injectable()
export class CardsService {
  private readonly logger = new Logger(CardsService.name);

  constructor(
    private prisma: PrismaService,
    private yangaplug: YangaplugService,
    private pin: PinService,
    private transactions: TransactionsService,
  ) {}

  private view(row: { status: string }) {
    return { enrolled: true, status: row.status, kycVerified: row.status === 'VERIFIED' };
  }

  // ---------- cardholder ----------

  /** Name, email and phone come from the account, so the cardholder always matches the user. Only KYC comes from the form. */
  async enroll(userId: number, dto: EnrollCardholderDto) {
    const user = await this.prisma.totalUser.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true, email: true, phoneNumber: true, deletedAt: true },
    });
    if (!user || user.deletedAt) throw new BadRequestException('User not found');

    const existing = await this.prisma.cardholder.findUnique({ where: { userId } });
    if (existing) return this.view(existing);

    // An earlier attempt may have created the cardholder on Yangaplug and then timed out: adopt it instead of duplicating.
    let remote;
    try {
      remote = await this.yangaplug.findCardholderByEmail(user.email);
    } catch {
      throw new ServiceUnavailableException('Card service is unavailable. Please try again shortly.');
    }

    if (!remote) {
      let res;
      try {
        res = await this.yangaplug.enrollCardholder({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phoneNumber,
          kyc: {
            bvn: dto.bvn,
            dob: dto.dob,
            id_type: dto.id_type,
            id_number: dto.id_number,
            id_image: dto.id_image,
            address_line_1: dto.address_line_1,
            city: dto.city,
            state: dto.state,
            country: dto.country.toUpperCase(),
            postal_code: dto.postal_code,
            selfie_image: dto.selfie_image,
          },
        });
      } catch {
        throw new ServiceUnavailableException('Card service is unavailable. Please try again shortly.');
      }
      if (!res.ok) {
        if (res.httpStatus === 422 && /not activated/i.test(res.message ?? '')) {
          throw new ServiceUnavailableException('Cards are not available yet. Please check back soon.');
        }
        const detail =
          process.env.NODE_ENV !== 'production' && res.message ? ` [${res.message}]` : '';
        throw new BadRequestException(
          `We could not verify your details. Check your BVN, ID and address and try again.${detail}`,
        );
      }
      remote = res.cardholder;
    }

    const row = await this.prisma.cardholder.upsert({
      where: { userId },
      create: { userId, yangaplugId: remote.id, status: remote.kycVerified ? 'VERIFIED' : 'PENDING_KYC' },
      update: {},
    });
    return this.view(row);
  }

  /** Current enrollment state. While not verified, re-checks Yangaplug (read-only, so a failed check just returns the stored state). */
  async getMine(userId: number) {
    const row = await this.prisma.cardholder.findUnique({ where: { userId } });
    if (!row) return { enrolled: false, status: null, kycVerified: false };

    if (row.status !== 'VERIFIED') {
      try {
        const user = await this.prisma.totalUser.findUnique({ where: { id: userId }, select: { email: true } });
        const remote = user ? await this.yangaplug.findCardholderByEmail(user.email) : null;
        if (remote?.kycVerified) {
          const updated = await this.prisma.cardholder.update({ where: { userId }, data: { status: 'VERIFIED' } });
          return this.view(updated);
        }
      } catch {
        // keep the stored state
      }
    }
    return this.view(row);
  }

  // ---------- cards ----------

  /** The user's cards. Only safe fields: no card number or CVV ever comes from our database. */
  async list(userId: number) {
    return this.prisma.card.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true, issuer: true, last4: true, status: true, balanceCents: true, createdAt: true },
    });
  }

  /** One card per user for now. The card starts PENDING and the card.created webhook makes it ACTIVE. */
  async createCard(userId: number, dto: CreateCardDto) {
    const holder = await this.prisma.cardholder.findUnique({ where: { userId } });
    if (!holder) throw new BadRequestException('Complete card verification first.');

    // Sandbox testing only: lets you try card creation while kyc_verified is still false
    const allowUnverified = process.env.CARDS_ALLOW_UNVERIFIED === 'true';
    if (holder.status !== 'VERIFIED' && !allowUnverified) {
      const fresh = await this.getMine(userId);
      if (!fresh.kycVerified) throw new BadRequestException('Your verification is still being reviewed.');
    }

    const open = await this.prisma.card.findFirst({
      where: { userId, status: { in: ['PENDING', 'ACTIVE', 'FROZEN'] } },
    });
    if (open) throw new ConflictException('You already have a card.');

    const card = await this.prisma.card.create({
      data: { userId, cardholderId: holder.id, issuer: dto.issuer, status: 'PENDING' },
    });

    try {
      const res = await this.yangaplug.createCard({ cardholderId: holder.yangaplugId, issuer: dto.issuer });
      if (!res.ok) {
        await this.prisma.card.update({ where: { id: card.id }, data: { status: 'FAILED' } });
        if (res.httpStatus === 422 && /not activated/i.test(res.message ?? '')) {
          throw new ServiceUnavailableException('Cards are not available yet. Please check back soon.');
        }
        throw new BadRequestException('We could not create your card. Please try again later.');
      }
      if (res.cardId) {
        await this.prisma.card.update({ where: { id: card.id }, data: { yangaplugId: res.cardId } });
      }
    } catch (err) {
      if (err instanceof BadRequestException || err instanceof ServiceUnavailableException) throw err;
      // Could not get a real answer: the card may exist on Yangaplug. Leave it PENDING, the webhook will settle it.
      this.logger.warn(`Create card for user ${userId} unclear, left PENDING (card ${card.id})`);
    }

    return { id: card.id, issuer: dto.issuer, status: 'PENDING' };
  }

  /**
   * Option A: the user pays in naira, converted at CARD_NGN_PER_USD (set it to your rate INCLUDING your margin),
   * plus an optional CARD_FUND_FEE_PERCENT. Money is taken first, then Yangaplug is asked to add the USD.
   *  - clean success   -> order SUCCESS, card balance goes up
   *  - clear rejection -> order FAILED and the naira is refunded
   *  - anything unclear -> order stays PENDING for you to check, never refunded by a guess
   */
    private ngnFor(usd: number): number {
    const rate = Number(process.env.CARD_NGN_PER_USD);
    if (!Number.isFinite(rate) || rate <= 0) {
      this.logger.error('CARD_NGN_PER_USD is not set');
      throw new ServiceUnavailableException('Card funding is not available right now.');
    }
    const feePct = Number(process.env.CARD_FUND_FEE_PERCENT ?? 0);
    return Math.round(usd * rate * (1 + (Number.isFinite(feePct) ? feePct : 0) / 100) * 100) / 100;
  }

  quote(usd: number) {
    if (!Number.isFinite(usd) || usd < 1 || usd > 500) throw new BadRequestException('Invalid amount');
    return { usd, ngn: this.ngnFor(usd) };
  }


  async fund(userId: number, cardId: number, dto: FundCardDto) {
    const card = await this.prisma.card.findFirst({ where: { id: cardId, userId } });
    if (!card) throw new NotFoundException('Card not found');
    if (card.status !== 'ACTIVE' || !card.yangaplugId) {
      throw new BadRequestException('This card is not ready to be funded.');
    }

    const rate = Number(process.env.CARD_NGN_PER_USD);
    if (!Number.isFinite(rate) || rate <= 0) {
      this.logger.error('CARD_NGN_PER_USD is not set');
      throw new ServiceUnavailableException('Card funding is not available right now.');
    }
    const feePct = Number(process.env.CARD_FUND_FEE_PERCENT ?? 0);
    // const ngn = Math.round(dto.amountUsd * rate * (1 + (Number.isFinite(feePct) ? feePct : 0) / 100) * 100) / 100;

    const ngn = this.ngnFor(dto.amountUsd);

    const reference = `cardfund_${userId}_${dto.requestId}`;

    // Same request twice (double tap, retry): report the first one, never run it again
    const already = await this.prisma.transaction.findUnique({ where: { idempotencyKey: reference } });
    if (already) return { status: already.status, chargedNgn: already.amount };

    await this.pin.verify(userId, dto.pin);

    try {
      await this.prisma.$transaction(async (tx) => {
        const res = await tx.totalUser.updateMany({
          where: { id: userId, balance: { gte: ngn } },
          data: { balance: { decrement: ngn } },
        });
        if (res.count === 0) throw new BadRequestException('Insufficient balance');
        await tx.transaction.create({
          data: {
            amount: ngn,
            type: 'CARD_FUNDING',
            provider: 'YANGAPLUG',
            providerRef: reference,
            idempotencyKey: reference,
            status: 'PENDING',
            description: 'Card funding',
            itemsPurchased: `Card funding $${dto.amountUsd.toFixed(2)}`,
            dayPurchased: new Date(),
            itemsTime: new Date(),
            meta: { cardId: card.id, usd: dto.amountUsd, rate, feePct },
            userId,
          },
        });
      });
    } catch (err: any) {
      if (err?.code === 'P2002') return { status: 'PENDING', chargedNgn: ngn }; // two identical requests raced
      throw err;
    }

    const result = await this.yangaplug.fundCard(card.yangaplugId, dto.amountUsd);

    if (result.outcome === 'SUCCESS') {
      await this.transactions.settle(reference, 'SUCCESS');
      await this.prisma.card.update({
        where: { id: card.id },
        data: { balanceCents: { increment: Math.round(dto.amountUsd * 100) } },
      });
      return { status: 'SUCCESS', chargedNgn: ngn };
    }

    if (result.outcome === 'REJECTED') {
      await this.transactions.settle(reference, 'FAILED'); // refunds the naira, once
      throw new BadRequestException('Card funding failed. You have not been charged.');
    }

    this.logger.warn(`Card funding ${reference} is unclear (HTTP ${result.httpStatus}), left PENDING for review`);
    return { status: 'PENDING', chargedNgn: ngn };
  }
}