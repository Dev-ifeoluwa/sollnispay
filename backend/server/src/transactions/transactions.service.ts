import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Moves a Sabuss order to its final state. Safe to call many times for the
   * same reference (webhook retries, reconciliation job): only the call that
   * actually changes the row does anything, so a refund can never happen twice.
   *
   * Returns true if this call changed the order.
   */
  async settle(reference: string, outcome: 'SUCCESS' | 'FAILED' | 'REVERSED'): Promise<boolean> {
    if (outcome === 'SUCCESS') {
      const res = await this.prisma.transaction.updateMany({
        where: { providerRef: reference, provider: 'SABUSS', status: 'PENDING' },
        data: { status: 'SUCCESS' },
      });
      return res.count > 0;
    }

    // FAILED only applies to orders still pending.
    // REVERSED can also apply to an order we had already marked SUCCESS.
    const allowedFrom: Array<'PENDING' | 'SUCCESS'> =
      outcome === 'FAILED' ? ['PENDING'] : ['PENDING', 'SUCCESS'];

    return this.prisma.$transaction(async (tx) => {
      const res = await tx.transaction.updateMany({
        where: { providerRef: reference, provider: 'SABUSS', status: { in: allowedFrom } },
        data: { status: outcome },
      });
      if (res.count === 0) return false; // already settled by someone else

      const order = await tx.transaction.findFirst({
        where: { providerRef: reference, provider: 'SABUSS' },
      });
      if (!order) return false;

      // refund what the USER paid (our own record), never the provider's number
      await tx.totalUser.update({
        where: { id: order.userId },
        data: { balance: { increment: order.amount } },
      });
      return true;
    });
  }
}