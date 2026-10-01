import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from 'src/prisma.service';
 
// Needed in live mode for businesses Paystack categorises as
// "Financial services", "Betting" or "General services" (Nigeria).
export type ComplianceInfo = {
  bvn: string;
  accountNumber: string; // the customer's own bank account number
  bankCode: string; // that bank's code, e.g. "058"
};
 
// If Paystack never answers (webhook lost), allow a fresh attempt after this long.
const RETRY_AFTER_MS = 15 * 60 * 1000;
 
@Injectable()
export class PaystackService {
  private readonly logger = new Logger(PaystackService.name);
  private readonly base = 'https://api.paystack.co';
 
  constructor(private http: HttpService, private prisma: PrismaService) {}
 
  private get secretKey(): string {
    return process.env.PAYSTACK_SECRET_KEY ?? '';
  }
 
  // test keys must use "test-bank"; live keys use a real provider slug
  private get preferredBank(): string {
    if (process.env.PAYSTACK_PREFERRED_BANK) return process.env.PAYSTACK_PREFERRED_BANK;
    return this.secretKey.startsWith('sk_test_') ? 'test-bank' : 'wema-bank';
  }
 
  // 08012345678 -> +2348012345678
  private toInternationalPhone(phone: string): string {
    const cleaned = (phone ?? '').replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) return cleaned;
    if (cleaned.startsWith('234')) return `+${cleaned}`;
    if (cleaned.startsWith('0')) return `+234${cleaned.slice(1)}`;
    return `+234${cleaned}`;
  }
 
  /**
   * Asks Paystack to create + assign a dedicated account for this user (single-step flow).
   * Paystack answers asynchronously: the account details arrive on the
   * `dedicatedaccount.assign.success` webhook, which saves them on the user.
   */
  async assignDedicatedAccount(userId: number, compliance?: ComplianceInfo) {
    if (!this.secretKey) throw new Error('PAYSTACK_SECRET_KEY is not set');
 
    const user = await this.prisma.totalUser.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
 
    if (user.paystackAccountNumber) {
      return { status: 'ACTIVE', accountNumber: user.paystackAccountNumber };
    }
 
    // A failed validation won't fix itself; wait until the user sends compliance details.
    if (user.paystackAccountStatus === 'FAILED' && !compliance) {
      return { status: 'FAILED' };
    }
 
    // Atomically "claim" the request so signup and /auth/me can't both fire it.
    const retryBefore = new Date(Date.now() - RETRY_AFTER_MS);
    const claim = await this.prisma.totalUser.updateMany({
      where: {
        id: userId,
        paystackAccountNumber: null,
        ...(compliance
          ? {}
          : {
              OR: [
                { paystackAssignRequestedAt: null },
                { paystackAssignRequestedAt: { lt: retryBefore } },
              ],
            }),
      },
      data: { paystackAccountStatus: 'PENDING', paystackAssignRequestedAt: new Date() },
    });
    if (claim.count === 0) return { status: 'PENDING' };
 
    const payload: Record<string, any> = {
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: this.toInternationalPhone(user.phoneNumber),
      preferred_bank: this.preferredBank,
      country: 'NG',
    };
    if (compliance) {
      payload.bvn = compliance.bvn;
      payload.account_number = compliance.accountNumber;
      payload.bank_code = compliance.bankCode;
    }
 
    try {
      await firstValueFrom(
        this.http.post(`${this.base}/dedicated_account/assign`, payload, {
          headers: { Authorization: `Bearer ${this.secretKey}` },
        }),
      );
      this.logger.log(`DVA assignment requested for user ${userId}`);
      return { status: 'PENDING' };
    } catch (err) {
      // release the claim so a later attempt can retry
      await this.prisma.totalUser.update({
        where: { id: userId },
        data: { paystackAccountStatus: null, paystackAssignRequestedAt: null },
      });
      throw err;
    }
  }
}
 