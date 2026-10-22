// import {
//   BadRequestException,
//   HttpException,
//   HttpStatus,
//   Injectable,
// } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { createHmac, randomInt, timingSafeEqual } from 'crypto';
// import { MailService } from 'src/mail/mail.service';
// import { PrismaService } from 'src/prisma.service';
// import { assertStrongPin } from 'src/common/pin-policy';

// const OTP_TTL_MS = 10 * 60 * 1000; // code lives 10 minutes
// const RESEND_COOLDOWN_MS = 60 * 1000; // one new code per minute
// const MAX_ATTEMPTS = 5; // wrong code OR wrong password guesses per code

// function getOtpSecret(): string {
//   const secret = process.env.OTP_SECRET;
//   if (!secret) throw new Error('OTP_SECRET is not set');
//   return secret;
// }

// // l***@gmail.com
// function maskEmail(email: string): string {
//   const [name, domain] = email.split('@');
//   if (!name || !domain) return email;
//   return `${name[0]}***@${domain}`;
// }

// @Injectable()
// export class PinResetService {
//   constructor(
//     private prisma: PrismaService,
//     private mail: MailService,
//   ) {}

//   // "PIN:" in the hash input means a PIN code can never match a password code.
//   private hashOtp(userId: number, otp: string): string {
//     return createHmac('sha256', getOtpSecret())
//       .update(`PIN:${userId}:${otp}`)
//       .digest('hex');
//   }

//   private safeEqual(a: string, b: string): boolean {
//     const bufA = Buffer.from(a);
//     const bufB = Buffer.from(b);
//     return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
//   }

//   // Step 1: logged-in user asks for a code. The email comes from the account,
//   // never from the request, so nobody can use this to email someone else.
//   async requestOtp(userId: number) {
//     const user = await this.prisma.totalUser.findUnique({
//       where: { id: userId },
//       select: { id: true, email: true, firstName: true, deletedAt: true, transactionPin: true },
//     });
//     if (!user || user.deletedAt) throw new BadRequestException('User not found');
//     if (!user.transactionPin) throw new BadRequestException('Set a transaction PIN first');

//     const last = await this.prisma.passwordReset.findFirst({
//       where: { userId, purpose: 'PIN' },
//       orderBy: { createdAt: 'desc' },
//     });
//     if (last && Date.now() - last.createdAt.getTime() < RESEND_COOLDOWN_MS) {
//       throw new HttpException(
//         'Please wait a minute before requesting another code.',
//         HttpStatus.TOO_MANY_REQUESTS,
//       );
//     }

//     const otp = randomInt(0, 1_000_000).toString().padStart(6, '0');

//     // kill older unused PIN codes, then create the new one
//     const [, created] = await this.prisma.$transaction([
//       this.prisma.passwordReset.updateMany({
//         where: { userId, purpose: 'PIN', usedAt: null },
//         data: { usedAt: new Date() },
//       }),
//       this.prisma.passwordReset.create({
//         data: {
//           userId,
//           purpose: 'PIN',
//           otpHash: this.hashOtp(userId, otp),
//           expiresAt: new Date(Date.now() + OTP_TTL_MS),
//         },
//       }),
//     ]);

//     // The user is logged in, so there is no account-enumeration risk here:
//     // we wait for the email and tell them honestly if it failed.
//     try {
//       await this.mail.sendPinResetOtp(user.email, user.firstName, otp);
//     } catch (err: any) {
//       console.error('Failed to send PIN reset OTP:', err?.message ?? err);
//       await this.prisma.passwordReset.delete({ where: { id: created.id } }).catch(() => null);
//       throw new BadRequestException('Could not send the code. Please try again.');
//     }

//     return { message: 'We sent a 6-digit code to your email.', email: maskEmail(user.email) };
//   }

//   // Step 2: verify code + account password, then set the new PIN.
//   async reset(userId: number, otp: string, password: string, newPin: string) {
//     // checked first so a weak PIN doesn't use up one of the 5 attempts
//     assertStrongPin(newPin);

//     const user = await this.prisma.totalUser.findUnique({
//       where: { id: userId },
//       select: { id: true, email: true, firstName: true, password: true, deletedAt: true },
//     });
//     if (!user || user.deletedAt) throw new BadRequestException('User not found');

//     const record = await this.prisma.passwordReset.findFirst({
//       where: { userId, purpose: 'PIN', usedAt: null, expiresAt: { gt: new Date() } },
//       orderBy: { createdAt: 'desc' },
//     });
//     if (!record) {
//       throw new BadRequestException('Code expired or not found. Please request a new one.');
//     }

//     // Burn an attempt BEFORE checking anything. It's atomic, so parallel requests
//     // can't get more than MAX_ATTEMPTS tries, and wrong passwords count too.
//     const burned = await this.prisma.passwordReset.updateMany({
//       where: { id: record.id, usedAt: null, attempts: { lt: MAX_ATTEMPTS } },
//       data: { attempts: { increment: 1 } },
//     });
//     if (burned.count === 0) {
//       throw new BadRequestException('Too many attempts. Please request a new code.');
//     }

//     // Code first: the password is only checked once the code is right,
//     // so this route can't be used to test passwords without inbox access.
//     if (!this.safeEqual(record.otpHash, this.hashOtp(userId, otp))) {
//       throw new BadRequestException('Incorrect code');
//     }

//     if (!(await bcrypt.compare(password, user.password))) {
//       throw new BadRequestException('Incorrect password');
//     }

//     const hash = await bcrypt.hash(newPin, 10);

//     await this.prisma.$transaction(async (tx) => {
//       // single-use: only one request can flip usedAt from null
//       const used = await tx.passwordReset.updateMany({
//         where: { id: record.id, usedAt: null },
//         data: { usedAt: new Date() },
//       });
//       if (used.count === 0) {
//         throw new BadRequestException('Code expired or not found. Please request a new one.');
//       }

//       await tx.totalUser.update({
//         where: { id: userId },
//         data: { transactionPin: hash, pinFailedAttempts: 0, pinLockedUntil: null },
//       });
//     });

//     this.mail.sendPinChanged(user.email, user.firstName).catch((err) => {
//       console.error('Failed to send PIN-changed email:', err?.message ?? err);
//     });

//     return { message: 'PIN reset successfully' };
//   }
// }





import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHmac, randomInt, timingSafeEqual } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';
import { assertStrongPin } from 'src/common/pin-policy';

const OTP_TTL_MS = 10 * 60 * 1000; // code lives 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // one new code per minute
const MAX_ATTEMPTS = 5; // wrong code OR wrong password guesses per code

function getOtpSecret(): string {
  const secret = process.env.OTP_SECRET;
  if (!secret) throw new Error('OTP_SECRET is not set');
  return secret;
}

// l***@gmail.com
function maskEmail(email: string): string {
  const [name, domain] = email.split('@');
  if (!name || !domain) return email;
  return `${name[0]}***@${domain}`;
}

@Injectable()
export class PinResetService {
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {}

  // "PIN:" in the hash input means a PIN code can never match a password code.
  private hashOtp(userId: number, otp: string): string {
    return createHmac('sha256', getOtpSecret())
      .update(`PIN:${userId}:${otp}`)
      .digest('hex');
  }

  private safeEqual(a: string, b: string): boolean {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
  }

  // Step 1: logged-in user asks for a code. The email comes from the account,
  // never from the request, so nobody can use this to email someone else.
  async requestOtp(userId: number) {
    const user = await this.prisma.totalUser.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, deletedAt: true, transactionPin: true },
    });
    if (!user || user.deletedAt) throw new BadRequestException('User not found');
    if (!user.transactionPin) throw new BadRequestException('Set a transaction PIN first');

    const last = await this.prisma.passwordReset.findFirst({
      where: { userId, purpose: 'PIN' },
      orderBy: { createdAt: 'desc' },
    });
    if (last && Date.now() - last.createdAt.getTime() < RESEND_COOLDOWN_MS) {
      throw new HttpException(
        'Please wait a minute before requesting another code.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const otp = randomInt(0, 1_000_000).toString().padStart(6, '0');

    // kill older unused PIN codes, then create the new one
    const [, created] = await this.prisma.$transaction([
      this.prisma.passwordReset.updateMany({
        where: { userId, purpose: 'PIN', usedAt: null },
        data: { usedAt: new Date() },
      }),
      this.prisma.passwordReset.create({
        data: {
          userId,
          purpose: 'PIN',
          otpHash: this.hashOtp(userId, otp),
          expiresAt: new Date(Date.now() + OTP_TTL_MS),
        },
      }),
    ]);

    // The user is logged in, so there is no account-enumeration risk here:
    // we wait for the email and tell them honestly if it failed.
    try {
      await this.mail.sendPinResetOtp(user.email, user.firstName, otp);
    } catch (err: any) {
      console.error('Failed to send PIN reset OTP:', err?.message ?? err);
      await this.prisma.passwordReset.delete({ where: { id: created.id } }).catch(() => null);
      throw new BadRequestException('Could not send the code. Please try again.');
    }

    return { message: 'We sent a 6-digit code to your email.', email: maskEmail(user.email) };
  }

  // Step 2: verify code + account password, then set the new PIN.
  async reset(userId: number, otp: string, password: string, newPin: string) {
    // checked first so a weak PIN doesn't use up one of the 5 attempts
    assertStrongPin(newPin);

    const user = await this.prisma.totalUser.findUnique({
      where: { id: userId },
      select: { id: true, email: true, firstName: true, password: true, deletedAt: true },
    });
    if (!user || user.deletedAt) throw new BadRequestException('User not found');

    const record = await this.prisma.passwordReset.findFirst({
      where: { userId, purpose: 'PIN', usedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) {
      throw new BadRequestException('Code expired or not found. Please request a new one.');
    }

    // Burn an attempt BEFORE checking anything. It's atomic, so parallel requests
    // can't get more than MAX_ATTEMPTS tries, and wrong passwords count too.
    const burned = await this.prisma.passwordReset.updateMany({
      where: { id: record.id, usedAt: null, attempts: { lt: MAX_ATTEMPTS } },
      data: { attempts: { increment: 1 } },
    });
    if (burned.count === 0) {
      throw new BadRequestException('Too many attempts. Please request a new code.');
    }

    // Code first: the password is only checked once the code is right,
    // so this route can't be used to test passwords without inbox access.
    if (!this.safeEqual(record.otpHash, this.hashOtp(userId, otp))) {
      throw new BadRequestException('Incorrect code');
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Incorrect password');
    }

    const hash = await bcrypt.hash(newPin, 10);

    await this.prisma.$transaction(async (tx) => {
      // single-use: only one request can flip usedAt from null
      const used = await tx.passwordReset.updateMany({
        where: { id: record.id, usedAt: null },
        data: { usedAt: new Date() },
      });
      if (used.count === 0) {
        throw new BadRequestException('Code expired or not found. Please request a new one.');
      }

      await tx.totalUser.update({
        where: { id: userId },
        data: { transactionPin: hash, pinFailedAttempts: 0, pinLockedUntil: null },
      });
    });

    this.mail.sendPinChanged(user.email, user.firstName).catch((err) => {
      console.error('Failed to send PIN-changed email:', err?.message ?? err);
    });

    return { message: 'PIN reset successfully' };
  }
}