import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
import { TransferSettlementService } from './transfer-settlement.service';

/** Safety net: settles bank transfers whose webhook never arrived. */
@Injectable()
export class TransferReconciliationService {
  private readonly logger = new Logger(TransferReconciliationService.name);
  private running = false;

  constructor(private prisma: PrismaService, private settlement: TransferSettlementService) {}

  @Cron('*/5 * * * *') // every 5 minutes
  async run() {
    if (this.running) return;
    this.running = true;
    try {
      const cutoff = new Date(Date.now() - 3 * 60 * 1000);
      const stale = await this.prisma.transaction.findMany({
        where: {
          provider: 'PAYSTACK',
          type: 'TRANSFER_BANK',
          status: 'PENDING',
          createdAt: { lt: cutoff },
          providerRef: { not: null },
        },
        orderBy: { createdAt: 'asc' },
        take: 50,
      });

      for (const order of stale) {
        try {
          const result = await this.settlement.reconcile(order.providerRef as string);
          const ageMin = (Date.now() - order.createdAt.getTime()) / 60000;
          const final = result === 'SUCCESS' || result === 'FAILED' || result === 'REVERSED';
          if (!final && ageMin > 30) {
            // Paystack doesn't know it, or it is stuck. NOT auto-refunded: needs a human to check.
            this.logger.warn(
              `Bank transfer ${order.providerRef} (user ${order.userId}) still "${result ?? 'unknown'}" after 30 min, review manually`,
            );
          }
        } catch (err: any) {
          this.logger.warn(`Reconcile ${order.providerRef} failed: ${err?.message}`);
        }
      }
    } finally {
      this.running = false;
    }
  }
}