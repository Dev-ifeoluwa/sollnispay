// import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
// import type { Request, Response } from 'express';
// import { AuthService } from './auth.service';
// import { UsersService } from 'src/users/users.service';
// import { JwtAuthGuard } from './jwt.auth.guard';
// import { MonnifyService } from 'src/monnify/monnify.service';

// @Controller('auth')
// export class AuthController {
//     constructor(
//         private authService: AuthService,
//         private usersService: UsersService,
//         private monnifyService: MonnifyService
//     ) { }

//     @Post("register")
//     async register(@Body() body: {
//         email: string;
//         password: string;
//         firstName: string;
//         lastName: string,
//         phoneNumber: string,
//         // transactionPin: string 
//     },
//         @Res({ passthrough: true }) res: Response) {
//         const existing = await this.usersService.findByEmail(body.email);
//         if (existing) throw new BadRequestException('User already exists');

//         const user = await this.usersService.createUser(
//             body.email,
//             body.password,
//             body.firstName,
//             body.lastName,
//             body.phoneNumber
//         );

//         // fire off reserved account creation — don't let it block signup if Monnify is slow/down
//         // this.monnifyService.createReservedAccountForUser(user.id).catch((err) => {
//         //     console.error('Failed to create Monnify reserved account:', err.message);
//         // });

//         this.monnifyService.createReservedAccountForUser(user.id).catch((err) => {
//             console.error('Failed to create Monnify reserved account:', err.response?.data ?? err.message);
//         });


//         const tokens = await this.authService.login(user);

//         res.cookie('jid', tokens.accessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 15 * 60 * 1000,
//         })
//         return { user };
//     }

//     @Post("setPin")
//     async setPin(@Body() body: { email: string; transactionPin: string }) {
//         const user = await this.usersService.findByEmail(body.email);
//         if (!user) throw new BadRequestException('User not found');

//         await this.usersService.updatePin(user.id, body.transactionPin);

//         return { message: 'PIN set successfully' };
//     }


//     @Post("login")
//     @HttpCode(200)
//     async login(@Body() body: { email: string; password: string },
//         @Res({ passthrough: true }) res: Response) {
//         const user = await this.authService.validateUser(body.email, body.password);
//         if (!user) throw new BadRequestException('Invalid credentials');

//         const tokens = await this.authService.login(user);
//         res.cookie('jid', tokens.accessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 15 * 60 * 1000,
//         });


//         res.cookie('refreshToken', tokens.refreshToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: 'lax',
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//         })
//         return { user, tokens };
//     }
//     // @UseGuards(JwtAuthGuard)
//     // @Get('me')
//     // async me(@Req() req: Request) {
//     //     const userId = (req.user as any)?.userId;
//     //     if (!userId) throw new BadRequestException('No user found');
//     //     const dashboard = await this.usersService.getUserDashboard(userId);
//     //     return { dashboard };
//     // }

//     // added-------------------------------------------------------------
//     @UseGuards(JwtAuthGuard)
//     @Get('me')
//     async me(@Req() req: Request) {
//     const userId = (req.user as any)?.userId;
//     if (!userId) throw new BadRequestException('No user found');

//     const dashboard = await this.usersService.getUserDashboard(userId);
//     if (!dashboard) throw new BadRequestException('No user found');

//     // no account number yet (old user, or Monnify failed at signup): create it now
//     if (!dashboard.accountNumber) {
//         try {
//             await this.monnifyService.createReservedAccountForUser(userId);
//         } catch (err: any) {
//             console.error('Monnify fallback failed:', err.response?.data ?? err.message);
//         }
//         const fresh = await this.usersService.findById(userId);
//         dashboard.accountNumber = fresh?.monnifyAccountNumber ?? null;
//     }

//         return { dashboard };
//     }


//     @Post("logout")
//     async logout(@Res({ passthrough: true }) res: Response) {
//         res.clearCookie('jid')
//         res.clearCookie('refreshToken')
//         return { message: 'Logged out' };
//     }
// }






import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtAuthGuard } from './jwt.auth.guard';
import { PaystackService } from 'src/paystack/paystack.service';
 
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService,
        private paystackService: PaystackService
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
 
        res.cookie('jid', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        })
        return { user };
    }
 
    @Post("setPin")
    async setPin(@Body() body: { email: string; transactionPin: string }) {
        const user = await this.usersService.findByEmail(body.email);
        if (!user) throw new BadRequestException('User not found');
 
        await this.usersService.updatePin(user.id, body.transactionPin);
 
        return { message: 'PIN set successfully' };
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
}