import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt.auth.guard';
import { PaystackService } from 'src/paystack/paystack.service';
import { Throttle } from '@nestjs/throttler/dist/throttler.decorator';
import { ThrottlerGuard } from '@nestjs/throttler';
import { PasswordResetService } from './password-reset.service';
 
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private paystackService: PaystackService,
        private passwordResetService: PasswordResetService,
    ) { }
 
    @Post("register")
    async register(@Body() body: {
        email: string;
        password: string;
        firstName: string;
        lastName: string,
        phoneNumber: string,
    },
        @Res({ passthrough: true }) res: Response) {
        const existing = await this.usersService.findByEmail(body.email);
        if (existing) throw new BadRequestException('User already exists');
 
        const user = await this.usersService.createUser(
            body.email,
            body.password,
            body.firstName,
            body.lastName,
            body.phoneNumber
        );
 
        // fire and forget: don't block signup if Paystack is slow/down.
        // The account details arrive later through the Paystack webhook.
        this.paystackService.assignDedicatedAccount(user.id).catch((err) => {
            console.error('Failed to request Paystack dedicated account:', err.response?.data ?? err.message);
        });
 
        const tokens = await this.authService.login(user);
        // added
        return { user, tokens };
 
        res.cookie('jid', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        })
        return { user };
    }
 
 
    @Post("login")
    @HttpCode(200)
    async login(@Body() body: { email: string; password: string },
        @Res({ passthrough: true }) res: Response) {
        const user = await this.authService.validateUser(body.email, body.password);
        if (!user) throw new BadRequestException('Invalid credentials');
 
        const tokens = await this.authService.login(user);
        res.cookie('jid', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });
 
 
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return { user, tokens };
    }
 
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@Req() req: Request) {
        const userId = (req.user as any)?.userId;
        if (!userId) throw new BadRequestException('No user found');
 
        const dashboard = await this.usersService.getUserDashboard(userId);
        if (!dashboard) throw new BadRequestException('No user found');
 
        // No account yet (old user, or the signup request failed): ask Paystack now.
        // The service ignores this if a request is already pending or has failed.
        if (!dashboard.accountNumber) {
            try {
                await this.paystackService.assignDedicatedAccount(userId);
            } catch (err: any) {
                console.error('Paystack fallback failed:', err.response?.data ?? err.message);
            }
        }
 
        return { dashboard };
    }
 
    // Live mode: for financial-services businesses Paystack needs the customer's BVN
    // plus their own bank account number and bank code before it issues an account.
    // The BVN is passed straight through and is never stored or logged.
    @UseGuards(JwtAuthGuard)
    @Post('generate-account')
    @HttpCode(200)
    async generateAccount(
        @Req() req: Request,
        @Body() body: { bvn?: string; accountNumber?: string; bankCode?: string },
    ) {
        const userId = (req.user as any)?.userId;
        if (!userId) throw new BadRequestException('No user found');
 
        let compliance: { bvn: string; accountNumber: string; bankCode: string } | undefined;
        if (body?.bvn || body?.accountNumber || body?.bankCode) {
            if (!/^\d{11}$/.test(body.bvn ?? '')) throw new BadRequestException('BVN must be 11 digits');
            if (!/^\d{10}$/.test(body.accountNumber ?? '')) throw new BadRequestException('Account number must be 10 digits');
            if (!body.bankCode) throw new BadRequestException('Bank code is required');
            compliance = { bvn: body.bvn!, accountNumber: body.accountNumber!, bankCode: body.bankCode };
        }
 
        try {
            return await this.paystackService.assignDedicatedAccount(userId, compliance);
        } catch (err: any) {
            console.error('generate-account failed:', err.response?.data?.message ?? err.message);
            throw new BadRequestException(err.response?.data?.message ?? 'Could not request account');
        }
    }
 
 
    @Post("logout")
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('jid')
        res.clearCookie('refreshToken')
        return { message: 'Logged out' };
    }


    @UseGuards(JwtAuthGuard)
    @Post('delete-account')
    @HttpCode(200)
    async deleteAccount(@Req() req: Request, @Body() body: { password: string }) {
        const userId = (req.user as any)?.userId;
        if (!userId) throw new BadRequestException('No user found');
        return this.authService.deleteAccount(userId, body?.password);
    }


    @Post('forgot-password')
    @HttpCode(200)
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 5, ttl: 60_000 } })
    async forgotPassword(@Body() body: { email: string }) {
    if (!body?.email) throw new BadRequestException('Email is required');
    await this.passwordResetService.requestOtp(body.email);
    return { message: 'If that email is registered, we have sent a 6-digit code.' };
   }
    

    @Post('reset-password')
    @HttpCode(200)
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 10, ttl: 60_000 } })
    async resetPassword(@Body() body: { email: string; otp: string; newPassword: string }) {
    return this.passwordResetService.resetPassword(body?.email, body?.otp, body?.newPassword);
   }


}