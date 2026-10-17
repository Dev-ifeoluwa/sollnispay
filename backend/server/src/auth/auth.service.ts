import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { PaystackService } from 'src/paystack/paystack.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private paystackService: PaystackService,
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        // only send the browser what it needs, never hashes or provider fields
        const { id, firstName, lastName, phoneNumber, balance, transactionPin } = user;
        return {
            id,
            email: user.email,
            firstName,
            lastName,
            phoneNumber,
            balance,
            hasPin: !!transactionPin,
        };
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(
            { sub: user.id },
            { expiresIn: '7d', secret: process.env.JWT_REFRESH_SECRET as string },
        );
        return { accessToken, refreshToken };
    }

    async deleteAccount(userId: number, password: string) {
        const user = await this.usersService.findById(userId);
        if (!user || user.deletedAt) throw new BadRequestException('Account not found');
        if (!password || !(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Incorrect password');
        }

        await this.usersService.anonymise(userId); // throws if balance or pending orders

        // after the database is safe, stop new deposits (best effort)
        try {
            await this.paystackService.deactivateDedicatedAccount(user.paystackCustomerCode);
        } catch (e: any) {
            console.error('DVA deactivation failed:', e?.response?.data ?? e?.message);
        }
        return { message: 'Account deleted' };
    }
}