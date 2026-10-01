import { Controller, HttpStatus, Logger, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import * as crypto from 'crypto';
import { PrismaService } from 'src/prisma.service';
 
@Controller('webhooks/paystack')
export class PaystackController {
  private readonly logger = new Logger(PaystackController.name);
 
  constructor(private prisma: PrismaService) {}
 
  // Paystack signs the raw body with your secret key (HMAC SHA512)
  private isValidSignature(rawBody: Buffer | undefined, signature: string | undefined): boolean {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret || !rawBody || !signature) return false;
 
    const expected = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  }
 
  @Post()
  async handleWebhook(@Req() req: Request, @Res() res: Response) {
    const signature = req.headers['x-paystack-signature'] as string | undefined;
    if (!this.isValidSignature((req as any).rawBody, signature)) {
      throw new UnauthorizedException('Invalid signature');
    }
 
    const event = req.body;
 
    try {
      switch (event?.event) {
        case 'charge.success':
          await this.handleChargeSuccess(event.data);
          break;
        case 'dedicatedaccount.assign.success':
          await this.handleAssignSuccess(event.data);
          break;
        case 'dedicatedaccount.assign.failed':
        case 'customeridentification.failed':
          await this.handleAssignFailed(event.data, event.event);
          break;
        default:
          // acknowledge events we don't care about
          break;
      }
    } catch (err: any) {
      // 500 makes Paystack retry, which is what we want for real processing errors
      this.logger.error(`Webhook ${event?.event} failed: ${err?.message}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
    }
 
    return res.status(HttpStatus.OK).send();
  }
 
  // ---------- money in ----------
  private async handleChargeSuccess(data: any) {
    const isDva =
      data?.channel === 'dedicated_nuban' || data?.authorization?.channel === 'dedicated_nuban';
    if (!isDva || data?.status !== 'success') return; // not a virtual account transfer
 
    const reference = data?.reference ? String(data.reference) : null;
    const kobo = Number(data?.amount);
    if (!reference || !Number.isFinite(kobo) || kobo <= 0) {
      this.logger.warn('charge.success with missing reference or amount, ignored');
      return;
    }
    const amountNaira = kobo / 100; // Paystack amounts are in kobo
 
    const idempotencyKey = `paystack:${reference}`;
    const existing = await this.prisma.transaction.findUnique({ where: { idempotencyKey } });
    if (existing) return; // already credited
 
    // find the user by customer code, falling back to the receiving account number
    const conditions: any[] = [];
    if (data?.customer?.customer_code) {
      conditions.push({ paystackCustomerCode: data.customer.customer_code });
    }
    if (data?.authorization?.receiver_bank_account_number) {
      conditions.push({ paystackAccountNumber: data.authorization.receiver_bank_account_number });
    }
    if (conditions.length === 0) {
      this.logger.warn(`charge.success ${reference}: nothing to match a user with`);
      return;
    }
 
    const user = await this.prisma.totalUser.findFirst({ where: { OR: conditions } });
    if (!user) {
      // return 200 (don't throw), otherwise Paystack retries forever
      this.logger.warn(`charge.success ${reference}: no matching user, needs manual review`);
      return;
    }
 
    try {
      await this.prisma.$transaction([
        this.prisma.totalUser.update({
          where: { id: user.id },
          data: { balance: { increment: amountNaira } },
        }),
        this.prisma.transaction.create({
          data: {
            amount: amountNaira,
            type: 'WALLET_FUNDING',
            provider: 'PAYSTACK',
            providerRef: reference,
            idempotencyKey,
            status: 'SUCCESS',
            description: 'Wallet funding via bank transfer',
            itemsPurchased: 'Wallet funding',
            dayPurchased: new Date(),
            itemsTime: new Date(),
            meta: {
              fees: data?.fees ?? null,
              senderName: data?.authorization?.sender_name ?? null,
              senderBank: data?.authorization?.sender_bank ?? null,
            },
            userId: user.id,
          },
        }),
      ]);
    } catch (err: any) {
      // two identical webhooks raced; the unique key caught the second one
      if (err?.code === 'P2002') return;
      throw err;
    }
  }
 
  // ---------- account created ----------
  private async handleAssignSuccess(data: any) {
    const email = data?.customer?.email;
    const dva = data?.dedicated_account;
    if (!email || !dva?.account_number) {
      this.logger.warn(`assign.success with unexpected payload: ${JSON.stringify(data)}`);
      return;
    }
 
    const user = await this.prisma.totalUser.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });
    if (!user) {
      this.logger.warn(`assign.success for unknown email ${email}`);
      return;
    }
 
    await this.prisma.totalUser.update({
      where: { id: user.id },
      data: {
        paystackCustomerCode: data?.customer?.customer_code ?? user.paystackCustomerCode,
        paystackAccountNumber: String(dva.account_number),
        paystackBankName: dva.bank?.name ?? null,
        paystackAccountName: dva.account_name ?? null,
        paystackAccountStatus: 'ACTIVE',
      },
    });
  }
 
  // ---------- account could not be created ----------
  private async handleAssignFailed(data: any, eventName: string) {
    const email = data?.customer?.email ?? data?.email;
    if (!email) return;
 
    this.logger.warn(`${eventName} for ${email}: ${data?.reason ?? 'no reason given'}`);
 
    const user = await this.prisma.totalUser.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } },
    });
    if (!user || user.paystackAccountNumber) return;
 
    await this.prisma.totalUser.update({
      where: { id: user.id },
      data: { paystackAccountStatus: 'FAILED' },
    });
  }
}
 