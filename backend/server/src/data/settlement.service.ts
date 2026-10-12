import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SabussService, outcomeFromCode } from 'src/sabuss/sabuss.service';
import { TransactionsService } from 'src/transactions/transactions.service';

/**
 * One place that decides what really happened to an order:
 * it asks Sabuss directly (query endpoint) and never trusts a webhook body.
 * Used by both the webhook and the reconciliation job.
 */
@Injectable()
export class SettlementService {
  private readonly logger = new Logger(SettlementService.name);

  constructor(
    private prisma: PrismaService,
    private sabuss: SabussService,
    private transactions: TransactionsService,
  ) {}

  async reconcile(reference: string): Promise<string | null> {
    const order = await this.prisma.transaction.findFirst({
      where: { providerRef: reference, provider: 'SABUSS' },
    });
    if (!order) {
      this.logger.warn(`Sabuss reference ${reference} matches no order`);
      return null;
    }
    // FAILED / REVERSED are final. PENDING and SUCCESS can still change.
    if (order.status === 'FAILED' || order.status === 'REVERSED') return order.status;

    const reply = await this.sabuss.query(reference);
    if (reply.reference && reply.reference !== reference) {
      this.logger.warn(`Query for ${reference} returned a different reference, ignoring`);
      return null;
    }

    const outcome = outcomeFromCode(reply.code);
    if (outcome === 'SUCCESS' || outcome === 'FAILED' || outcome === 'REVERSED') {
      const changed = await this.transactions.settle(reference, outcome);
      if (changed) this.logger.log(`Order ${reference} -> ${outcome}`);
    }
    return outcome;
  }
}