// import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { PrismaService } from 'src/prisma.service';

// const MAX_ATTEMPTS = 5;
// const LOCK_MS = 15 * 60 * 1000;

// @Injectable()
// export class PinService {
//   constructor(private prisma: PrismaService) {}

//   /** First-time PIN. Refuses if one already exists (use change for that). */
//   async set(userId: number, pin: string) {
//     const user = await this.prisma.totalUser.findUnique({
//       where: { id: userId },
//       select: { transactionPin: true },
//     });
//     if (!user) throw new BadRequestException('User not found');
//     if (user.transactionPin) throw new BadRequestException('PIN already set. Use change PIN instead.');

//     const hash = await bcrypt.hash(pin, 10);
//     // updateMany + the null check closes the race between two parallel set requests
//     const res = await this.prisma.totalUser.updateMany({
//       where: { id: userId, transactionPin: null },
//       data: { transactionPin: hash },
//     });
//     if (res.count === 0) throw new BadRequestException('PIN already set. Use change PIN instead.');
//     return { message: 'PIN set successfully' };
//   }

//   async change(userId: number, currentPin: string, newPin: string) {
//     await this.verify(userId, currentPin);
//     const hash = await bcrypt.hash(newPin, 10);
//     await this.prisma.totalUser.update({ where: { id: userId }, data: { transactionPin: hash } });
//     return { message: 'PIN changed successfully' };
//   }

//   /** Throws unless the PIN is correct. Locks the PIN after too many wrong tries. */
//   async verify(userId: number, pin: string): Promise<void> {
//     const user = await this.prisma.totalUser.findUnique({
//       where: { id: userId },
//       select: { transactionPin: true, pinFailedAttempts: true, pinLockedUntil: true },
//     });
//     if (!user) throw new BadRequestException('User not found');
//     if (!user.transactionPin) throw new BadRequestException('Set a transaction PIN first');

//     if (user.pinLockedUntil && user.pinLockedUntil > new Date()) {
//       const mins = Math.ceil((user.pinLockedUntil.getTime() - Date.now()) / 60000);
//       throw new ForbiddenException(`Too many wrong attempts. Try again in ${mins} minute(s).`);
//     }

//     const ok = await bcrypt.compare(pin, user.transactionPin);
//     if (!ok) {
//       // atomic increment so parallel guesses can't dodge the counter
//       const updated = await this.prisma.totalUser.update({
//         where: { id: userId },
//         data: { pinFailedAttempts: { increment: 1 } },
//         select: { pinFailedAttempts: true },
//       });
//       if (updated.pinFailedAttempts >= MAX_ATTEMPTS) {
//         await this.prisma.totalUser.update({
//           where: { id: userId },
//           data: { pinFailedAttempts: 0, pinLockedUntil: new Date(Date.now() + LOCK_MS) },
//         });
//         throw new ForbiddenException('Too many wrong attempts. PIN locked for 15 minutes.');
//       }
//       throw new BadRequestException('Incorrect PIN');
//     }

//     if (user.pinFailedAttempts > 0 || user.pinLockedUntil) {
//       await this.prisma.totalUser.update({
//         where: { id: userId },
//         data: { pinFailedAttempts: 0, pinLockedUntil: null },
//       });
//     }
//   }
// }



import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma.service';
import { assertStrongPin } from 'src/common/pin-policy';

const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

@Injectable()
export class PinService {
  constructor(private prisma: PrismaService) {}

  /** First-time PIN. Refuses if one already exists (use change for that). */
  async set(userId: number, pin: string) {
    assertStrongPin(pin);

    const user = await this.prisma.totalUser.findUnique({
      where: { id: userId },
      select: { transactionPin: true },
    });
    if (!user) throw new BadRequestException('User not found');
    if (user.transactionPin) throw new BadRequestException('PIN already set. Use change PIN instead.');

    const hash = await bcrypt.hash(pin, 10);
    // updateMany + the null check closes the race between two parallel set requests
    const res = await this.prisma.totalUser.updateMany({
      where: { id: userId, transactionPin: null },
      data: { transactionPin: hash },
    });
    if (res.count === 0) throw new BadRequestException('PIN already set. Use change PIN instead.');
    return { message: 'PIN set successfully' };
  }

  async change(userId: number, currentPin: string, newPin: string) {
    // checked first, so a weak new PIN doesn't use up a wrong-PIN attempt
    assertStrongPin(newPin);
    if (currentPin === newPin) {
      throw new BadRequestException('New PIN must be different from your current PIN.');
    }

    await this.verify(userId, currentPin);
    const hash = await bcrypt.hash(newPin, 10);
    await this.prisma.totalUser.update({ where: { id: userId }, data: { transactionPin: hash } });
    return { message: 'PIN changed successfully' };
  }

  /** Throws unless the PIN is correct. Locks the PIN after too many wrong tries. */
  async verify(userId: number, pin: string): Promise<void> {
    const user = await this.prisma.totalUser.findUnique({
      where: { id: userId },
      select: { transactionPin: true, pinFailedAttempts: true, pinLockedUntil: true },
    });
    if (!user) throw new BadRequestException('User not found');
    if (!user.transactionPin) throw new BadRequestException('Set a transaction PIN first');

    if (user.pinLockedUntil && user.pinLockedUntil > new Date()) {
      const mins = Math.ceil((user.pinLockedUntil.getTime() - Date.now()) / 60000);
      throw new ForbiddenException(`Too many wrong attempts. Try again in ${mins} minute(s).`);
    }

    const ok = await bcrypt.compare(pin, user.transactionPin);
    if (!ok) {
      // atomic increment so parallel guesses can't dodge the counter
      const updated = await this.prisma.totalUser.update({
        where: { id: userId },
        data: { pinFailedAttempts: { increment: 1 } },
        select: { pinFailedAttempts: true },
      });
      if (updated.pinFailedAttempts >= MAX_ATTEMPTS) {
        await this.prisma.totalUser.update({
          where: { id: userId },
          data: { pinFailedAttempts: 0, pinLockedUntil: new Date(Date.now() + LOCK_MS) },
        });
        throw new ForbiddenException('Too many wrong attempts. PIN locked for 15 minutes.');
      }
      throw new BadRequestException('Incorrect PIN');
    }

    if (user.pinFailedAttempts > 0 || user.pinLockedUntil) {
      await this.prisma.totalUser.update({
        where: { id: userId },
        data: { pinFailedAttempts: 0, pinLockedUntil: null },
      });
    }
  }
}