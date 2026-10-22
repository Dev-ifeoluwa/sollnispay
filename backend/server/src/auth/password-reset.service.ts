// import { BadRequestException, Injectable } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
// import { createHmac, randomInt, timingSafeEqual } from 'crypto';
// import { MailService } from 'src/mail/mail.service';
// import { PrismaService } from 'src/prisma.service';
// import { UsersService } from 'src/users/users.service';

// const OTP_TTL_MS = 10 * 60 * 1000; // code lives 10 minutes
// const RESEND_COOLDOWN_MS = 60 * 1000; // at most one new code per minute
// const MAX_ATTEMPTS = 5; // wrong guesses allowed per code

// // One message for every failure, so an attacker can't tell
// // "no such email" from "wrong code" from "expired code".
// const GENERIC_ERROR = 'Invalid or expired code. Please request a new one.';

// function getOtpSecret(): string {
//     const secret = process.env.OTP_SECRET;
//     if (!secret) throw new Error('OTP_SECRET is not set');
//     return secret;
// }

// @Injectable()
// export class PasswordResetService {
//     constructor(
//         private prisma: PrismaService,
//         private usersService: UsersService,
//         private mail: MailService,
//     ) {}

//     // HMAC with a server secret: a 6-digit code has only 1,000,000 possibilities,
//     // so a plain hash could be cracked instantly if the table ever leaked.
//     private hashOtp(userId: number, otp: string): string {
//         return createHmac('sha256', getOtpSecret()).update(`${userId}:${otp}`).digest('hex');
//     }

//     private safeEqual(a: string, b: string): boolean {
//         const bufA = Buffer.from(a);
//         const bufB = Buffer.from(b);
//         return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
//     }

//     // Step 1: always resolves quietly, whether or not the email exists.
//     async requestOtp(email: string): Promise<void> {
//         const user = await this.usersService.findByEmail(email.trim());
//         if (!user || user.deletedAt) return;

//         // resend cooldown
//         const last = await this.prisma.passwordReset.findFirst({
//             where: { userId: user.id },
//             orderBy: { createdAt: 'desc' },
//         });
//         if (last && Date.now() - last.createdAt.getTime() < RESEND_COOLDOWN_MS) return;

//         const otp = randomInt(0, 1_000_000).toString().padStart(6, '0');

//         // kill any older unused codes, then create the new one
//         await this.prisma.$transaction([
//             this.prisma.passwordReset.updateMany({
//                 where: { userId: user.id, usedAt: null },
//                 data: { usedAt: new Date() },
//             }),
//             this.prisma.passwordReset.create({
//                 data: {
//                     userId: user.id,
//                     otpHash: this.hashOtp(user.id, otp),
//                     expiresAt: new Date(Date.now() + OTP_TTL_MS),
//                 },
//             }),
//         ]);

//         // not awaited, so the response time doesn't reveal whether the email exists
//         this.mail.sendPasswordResetOtp(user.email, user.firstName, otp).catch((err) => {
//             console.error('Failed to send reset OTP:', err?.message ?? err);
//         });
//     }

//     // Step 2: verify the code and set the new password.
//     async resetPassword(email: string, otp: string, newPassword: string) {
//         if (!/^\d{6}$/.test(otp ?? '')) throw new BadRequestException(GENERIC_ERROR);
//         if (!newPassword || newPassword.length < 8) {
//             throw new BadRequestException('Password must be at least 8 characters');
//         }

//         const user = await this.usersService.findByEmail((email ?? '').trim());
//         if (!user || user.deletedAt) throw new BadRequestException(GENERIC_ERROR);

//         const record = await this.prisma.passwordReset.findFirst({
//             where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } },
//             orderBy: { createdAt: 'desc' },
//         });
//         if (!record) throw new BadRequestException(GENERIC_ERROR);

//         // Burn an attempt BEFORE checking the code. The conditional update is atomic,
//         // so even parallel requests can't squeeze in more than MAX_ATTEMPTS guesses.
//         const burned = await this.prisma.passwordReset.updateMany({
//             where: { id: record.id, usedAt: null, attempts: { lt: MAX_ATTEMPTS } },
//             data: { attempts: { increment: 1 } },
//         });
//         if (burned.count === 0) throw new BadRequestException(GENERIC_ERROR);

//         if (!this.safeEqual(record.otpHash, this.hashOtp(user.id, otp))) {
//             throw new BadRequestException(GENERIC_ERROR);
//         }

//         const hashed = await bcrypt.hash(newPassword, 10);

//         await this.prisma.$transaction(async (tx) => {
//             // single-use: only one request can flip usedAt from null
//             const used = await tx.passwordReset.updateMany({
//                 where: { id: record.id, usedAt: null },
//                 data: { usedAt: new Date() },
//             });
//             if (used.count === 0) throw new BadRequestException(GENERIC_ERROR);

//             await tx.totalUser.update({
//                 where: { id: user.id },
//                 data: { password: hashed, passwordChangedAt: new Date() },
//             });
//         });

//         this.mail.sendPasswordChanged(user.email, user.firstName).catch((err) => {
//             console.error('Failed to send password-changed email:', err?.message ?? err);
//         });

//         return { message: 'Password reset successful' };
//     }
// }





import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHmac, randomInt, timingSafeEqual } from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { PrismaService } from 'src/prisma.service';
import { UsersService } from 'src/users/users.service';
import { assertNoPersonalInfo, assertStrongPassword } from 'src/common/password-policy';

const OTP_TTL_MS = 10 * 60 * 1000; // code lives 10 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // at most one new code per minute
const MAX_ATTEMPTS = 5; // wrong guesses allowed per code

// One message for every failure, so an attacker can't tell
// "no such email" from "wrong code" from "expired code".
const GENERIC_ERROR = 'Invalid or expired code. Please request a new one.';

function getOtpSecret(): string {
    const secret = process.env.OTP_SECRET;
    if (!secret) throw new Error('OTP_SECRET is not set');
    return secret;
}

@Injectable()
export class PasswordResetService {
    constructor(
        private prisma: PrismaService,
        private usersService: UsersService,
        private mail: MailService,
    ) {}

    // HMAC with a server secret: a 6-digit code has only 1,000,000 possibilities,
    // so a plain hash could be cracked instantly if the table ever leaked.
    private hashOtp(userId: number, otp: string): string {
        return createHmac('sha256', getOtpSecret()).update(`${userId}:${otp}`).digest('hex');
    }

    private safeEqual(a: string, b: string): boolean {
        const bufA = Buffer.from(a);
        const bufB = Buffer.from(b);
        return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
    }

    // Step 1: always resolves quietly, whether or not the email exists.
    async requestOtp(email: string): Promise<void> {
        const user = await this.usersService.findByEmail(email.trim());
        if (!user || user.deletedAt) return;

        // resend cooldown
        const last = await this.prisma.passwordReset.findFirst({
            where: { userId: user.id, purpose: 'PASSWORD' },
            orderBy: { createdAt: 'desc' },
        });
        if (last && Date.now() - last.createdAt.getTime() < RESEND_COOLDOWN_MS) return;

        const otp = randomInt(0, 1_000_000).toString().padStart(6, '0');

        // kill any older unused codes, then create the new one
        await this.prisma.$transaction([
            this.prisma.passwordReset.updateMany({
                where: { userId: user.id, usedAt: null, purpose: 'PASSWORD' },
                data: { usedAt: new Date() },
            }),
            this.prisma.passwordReset.create({
                data: {
                    userId: user.id,
                    otpHash: this.hashOtp(user.id, otp),
                    expiresAt: new Date(Date.now() + OTP_TTL_MS),
                },
            }),
        ]);

        // not awaited, so the response time doesn't reveal whether the email exists
        this.mail.sendPasswordResetOtp(user.email, user.firstName, otp).catch((err) => {
            console.error('Failed to send reset OTP:', err?.message ?? err);
        });
    }

    // Step 2: verify the code and set the new password.
    async resetPassword(email: string, otp: string, newPassword: string) {
        if (!/^\d{6}$/.test(otp ?? '')) throw new BadRequestException(GENERIC_ERROR);
        // Rules that need only the password run first. The name/email check waits
        // until the code is verified, so a weak-password error never reveals
        // whether an account exists.
        assertStrongPassword(newPassword);

        const user = await this.usersService.findByEmail((email ?? '').trim());
        if (!user || user.deletedAt) throw new BadRequestException(GENERIC_ERROR);

        const record = await this.prisma.passwordReset.findFirst({
            where: {
                userId: user.id,
                purpose: 'PASSWORD',
                usedAt: null,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!record) throw new BadRequestException(GENERIC_ERROR);

        // Burn an attempt BEFORE checking the code. The conditional update is atomic,
        // so even parallel requests can't squeeze in more than MAX_ATTEMPTS guesses.
        const burned = await this.prisma.passwordReset.updateMany({
            where: { id: record.id, usedAt: null, attempts: { lt: MAX_ATTEMPTS } },
            data: { attempts: { increment: 1 } },
        });
        if (burned.count === 0) throw new BadRequestException(GENERIC_ERROR);

        if (!this.safeEqual(record.otpHash, this.hashOtp(user.id, otp))) {
            throw new BadRequestException(GENERIC_ERROR);
        }

        assertNoPersonalInfo(newPassword, user);

        const hashed = await bcrypt.hash(newPassword, 10);

        await this.prisma.$transaction(async (tx) => {
            // single-use: only one request can flip usedAt from null
            const used = await tx.passwordReset.updateMany({
                where: { id: record.id, usedAt: null },
                data: { usedAt: new Date() },
            });
            if (used.count === 0) throw new BadRequestException(GENERIC_ERROR);

            await tx.totalUser.update({
                where: { id: user.id },
                data: { password: hashed, passwordChangedAt: new Date() },
            });
        });

        this.mail.sendPasswordChanged(user.email, user.firstName).catch((err) => {
            console.error('Failed to send password-changed email:', err?.message ?? err);
        });

        return { message: 'Password reset successful' };
    }
}