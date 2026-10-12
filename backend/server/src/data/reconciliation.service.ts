import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
import { SettlementService } from './settlement.service';

/** Safety net: settles orders whose webhook never arrived. */
@Injectable()
export class ReconciliationService {
  private readonly logger = new Logger(ReconciliationService.name);
  private running = false;

  constructor(private prisma: PrismaService, private settlement: SettlementService) {}

  @Cron('*/5 * * * *') // every 5 minutes
  async run() {
    if (this.running) return;
    this.running = true;
    try {
      const cutoff = new Date(Date.now() - 3 * 60 * 1000);
      const stale = await this.prisma.transaction.findMany({
        where: {
          provider: 'SABUSS',
          status: 'PENDING',
          createdAt: { lt: cutoff },
          providerRef: { not: null },
        },
        orderBy: { createdAt: 'asc' },
        take: 50,
      });

      for (const order of stale) {
        try {
          const outcome = await this.settlement.reconcile(order.providerRef as string);
          const ageMin = (Date.now() - order.createdAt.getTime()) / 60000;
          if (outcome === null && ageMin > 30) {
            // Sabuss doesn't know this order. NOT auto-refunded: needs a human to check.
            this.logger.warn(`Order ${order.providerRef} (user ${order.userId}) unresolved after 30 min, review manually`);
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