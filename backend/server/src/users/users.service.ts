import { Injectable, ParseIntPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    // ---------
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

    async updatePin(userId: number, transactionPin: string) {
      const hasedPin = await bcrypt.hash(transactionPin, 10)

      return this.prisma.totalUser.update({
        where: { id: userId },
        data: { transactionPin: hasedPin },
      });
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
    return this.prisma.totalUser.findUnique({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      balance: true,
      // accountNumber: true,
      phoneNumber: true,
      transactions: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          itemsPurchased: true,
          dayPurchased: true,
          itemsTime: true,
          description: true,
          amount: true,
        },
      },
    },
  });
}

}
