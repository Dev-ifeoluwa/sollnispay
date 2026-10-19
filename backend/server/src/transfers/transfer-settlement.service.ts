import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PaystackTransferService } from 'src/paystack/paystack-transfer.service';

export type TransferOutcome = 'SUCCESS' | 'FAILED' | 'REVERSED';

// Paystack transfer statuses: success, failed, reversed are final.
// pending / received / otp / processing... can still change, so we never guess.
export function outcomeFromPaystack(status: string | null): TransferOutcome | null {
  switch (status) {
    case 'success':
      return 'SUCCESS';
    case 'failed':
      return 'FAILED';
    case 'reversed':
      return 'REVERSED';
    default:
      return null;
  }
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * One place that decides what really happened to a bank transfer.
 * It asks Paystack directly (verify) and never trusts a webhook body.
 * Used by the webhook, the reconciliation job, and the immediate-rejection path.
 */
@Injectable()
export class TransferSettlementService {
  private readonly logger = new Logger(TransferSettlementService.name);

  constructor(private prisma: PrismaService, private paystack: PaystackTransferService) {}

  /** Returns the final outcome, the raw Paystack status if not final yet, or null if unknown. */
  async reconcile(reference: string): Promise<string | null> {
    const order = await this.prisma.transaction.findFirst({
      where: { providerRef: reference, provider: 'PAYSTACK', type: 'TRANSFER_BANK' },
    });
    // the webhook also carries other Paystack transfers; only ours are handled here
    if (!order) return null;
    // FAILED / REVERSED are final. PENDING and SUCCESS can still change.
    if (order.status === 'FAILED' || order.status === 'REVERSED') return order.status;

    const status = await this.paystack.verifyTransfer(reference); // throws if Paystack can't be reached
    const outcome = outcomeFromPaystack(status);
    if (outcome) {
      const changed = await this.settle(reference, outcome);
      if (changed) this.logger.log(`Bank transfer ${reference} -> ${outcome}`);
      return outcome;
    }
    return status;
  }

  /**
   * Moves a bank transfer to its final state. Safe to call many times for the same
   * reference: only the call that actually changes the row does anything, so a refund
   * can never happen twice. Returns true if this call changed the order.
   */
  async settle(reference: string, outcome: TransferOutcome): Promise<boolean> {
    const base = { providerRef: reference, provider: 'PAYSTACK' as const, type: 'TRANSFER_BANK' as const };

    if (outcome === 'SUCCESS') {
      const res = await this.prisma.transaction.updateMany({
        where: { ...base, status: 'PENDING' },
        data: { status: 'SUCCESS' },
      });
      return res.count > 0;
    }

    // FAILED only applies to transfers still pending.
    // REVERSED can also apply to one we had already marked SUCCESS.
    const allowedFrom: Array<'PENDING' | 'SUCCESS'> =
      outcome === 'FAILED' ? ['PENDING'] : ['PENDING', 'SUCCESS'];

    return this.prisma.$transaction(async (tx) => {
      const res = await tx.transaction.updateMany({
        where: { ...base, status: { in: allowedFrom } },
        data: { status: outcome },
      });
      if (res.count === 0) return false; // already settled by someone else

      const order = await tx.transaction.findFirst({ where: base });
      if (!order) return false;

      // give back what the user paid: the amount AND the fee
      const fee = Number((order.meta as any)?.fee ?? 0);
      const refund = round2(order.amount + (Number.isFinite(fee) ? fee : 0));
      await tx.totalUser.update({
        where: { id: order.userId },
        data: { balance: { increment: refund } },
      });
      return true;
    });
  }
}