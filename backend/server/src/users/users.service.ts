import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { BadRequestException } from '@nestjs/common';
 
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
 
   
    async createUser(
                    email: string, password: string, 
                    firstName: string, lastName: string, 
                    phoneNumber: string
                    ) {
        const hash = await bcrypt.hash(password, 10);
        const user = await this.prisma.totalUser.create({
            data: {
                email,
                password: hash,
                firstName,
                lastName,
                phoneNumber,
                balance: 0
            },
            select: { 
                id: true, 
                email: true, 
                firstName: true, 
                lastName: true, 
                phoneNumber: true,
                createdAt: true, 
                updatedAt: true,
                balance: true
            }
        })
        return user;
    } 
 
    // ---------
    async findByEmail(email: string) {
        return this.prisma.totalUser.findUnique({
            where: { email }
        });
    }
 
    // ---------
    async findById(id: number) {
        return this.prisma.totalUser.findUnique({
            where: { id }
        });
    }
 
    async getUserDashboard(id: number) {
      const user = await this.prisma.totalUser.findUnique({
        where: { id },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          balance: true,
          phoneNumber: true,
          // Paystack dedicated account
          paystackAccountNumber: true,
          paystackBankName: true,
          paystackAccountName: true,
          paystackAccountStatus: true,
          transactions: {
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              type: true,        // added: decides credit vs debit
              createdAt: true,   // added: powers the 7 / 30 day filter
              itemsPurchased: true,
              dayPurchased: true,
              itemsTime: true,
              description: true,
              amount: true,
            },
          },
        },
      });
 
      if (!user) return null;
 
      // rename so the dashboard can read simple field names
      const {
        paystackAccountNumber,
        paystackBankName,
        paystackAccountName,
        paystackAccountStatus,
        ...rest
      } = user;
 
      return {
        ...rest,
        accountNumber: paystackAccountNumber,
        bankName: paystackBankName,
        accountName: paystackAccountName,
        accountStatus: paystackAccountStatus,
      };
    }


    async anonymise(userId: number) {
      const randomPw = await bcrypt.hash(randomUUID(), 10);
      await this.prisma.$transaction(async (tx) => {
        const pending = await tx.transaction.count({ where: { userId, status: 'PENDING' } });
        if (pending > 0) throw new BadRequestException('You have a pending transaction. Try again once it completes.');

        const res = await tx.totalUser.updateMany({
          where: { id: userId, deletedAt: null, balance: { lt: 0.01 } },
          data: {
            deletedAt: new Date(),
            email: `deleted-${userId}@deleted.invalid`,
            firstName: 'Deleted', lastName: 'User', phoneNumber: '',
            password: randomPw, transactionPin: null,
            pinFailedAttempts: 0, pinLockedUntil: null,
            paystackCustomerCode: null, paystackAccountNumber: null,
            paystackAccountName: null, paystackBankName: null, paystackAccountStatus: null,
            monnifyAccountRef: null, monnifyAccountNumber: null, monnifyAccountStatus: null,
          },
        });
        if (res.count === 0) throw new BadRequestException('Spend or withdraw your balance before deleting your account.');
      });
    }
 
}
 