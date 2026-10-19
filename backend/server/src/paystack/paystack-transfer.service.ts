import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export type PaystackBank = { name: string; code: string };

/** Paystack clearly said no (a 4xx answer). Nothing was done on their side. */
export class PaystackRejected extends Error {
  constructor(message: string, public readonly httpStatus: number) {
    super(message);
  }
}

/** We don't know what happened (network error, timeout, or a 5xx from Paystack). */
export class PaystackUnknown extends Error {}

export interface TransferReply {
  ok: boolean; // false = Paystack rejected the request (4xx)
  httpStatus: number;
  status: string | null; // success | pending | received | otp | failed | reversed ...
  transferCode: string | null;
  message: string | null;
}

@Injectable()
export class PaystackTransferService {
  private readonly logger = new Logger(PaystackTransferService.name);
  private readonly base = 'https://api.paystack.co';
  private banksCache: { banks: PaystackBank[]; at: number } | null = null;

  constructor(private http: HttpService) {}

  private get secretKey(): string {
    const key = process.env.PAYSTACK_SECRET_KEY;
    if (!key) throw new Error('PAYSTACK_SECRET_KEY is not set');
    return key;
  }

  // One place for every call. 4xx answers are returned so the caller decides what they mean;
  // network errors and 5xx become PaystackUnknown. Errors never include the axios config (it holds the key).
  private async call(
    method: 'GET' | 'POST',
    path: string,
    opts: { params?: Record<string, any>; data?: any } = {},
  ): Promise<{ httpStatus: number; ok: boolean; body: any }> {
    let res;
    try {
      res = await firstValueFrom(
        this.http.request({
          method,
          url: `${this.base}${path}`,
          params: opts.params,
          data: opts.data,
          headers: { Authorization: `Bearer ${this.secretKey}` },
          timeout: 30_000,
          validateStatus: () => true,
        }),
      );
    } catch (err: any) {
      throw new PaystackUnknown(`Paystack ${path} request failed: ${err?.code ?? err?.message ?? 'unknown error'}`);
    }
    if (res.status >= 500) throw new PaystackUnknown(`Paystack ${path} answered ${res.status}`);
    return { httpStatus: res.status, ok: res.status >= 200 && res.status < 300, body: res.data };
  }

  /** All active Nigerian banks. Cached for 24 hours. */
  async listBanks(): Promise<PaystackBank[]> {
    const DAY = 24 * 60 * 60 * 1000;
    if (this.banksCache && Date.now() - this.banksCache.at < DAY) return this.banksCache.banks;

    const byCode = new Map<string, PaystackBank>();
    let next: string | undefined;
    for (let page = 0; page < 10; page++) {
      const r = await this.call('GET', '/bank', {
        params: { country: 'nigeria', currency: 'NGN', use_cursor: true, perPage: 100, ...(next ? { next } : {}) },
      });
      if (!r.ok) throw new PaystackRejected(r.body?.message ?? 'Could not list banks', r.httpStatus);
      for (const b of r.body?.data ?? []) {
        if (b?.active === false || !b?.code || !b?.name) continue;
        byCode.set(String(b.code), { name: String(b.name), code: String(b.code) });
      }
      next = r.body?.meta?.next || undefined;
      if (!next) break;
    }

    const banks = [...byCode.values()].sort((a, b) => a.name.localeCompare(b.name));
    if (banks.length > 0) this.banksCache = { banks, at: Date.now() };
    return banks;
  }

  /** The real account holder's name, straight from the bank via Paystack. */
  async resolveAccount(accountNumber: string, bankCode: string): Promise<string> {
    const r = await this.call('GET', '/bank/resolve', {
      params: { account_number: accountNumber, bank_code: bankCode },
    });
    const name = r.body?.data?.account_name;
    if (!r.ok || !name) throw new PaystackRejected(r.body?.message ?? 'Could not verify this account', r.httpStatus);
    return String(name);
  }

  /** Creates (or finds) the payout recipient and returns its code. */
  async createRecipient(name: string, accountNumber: string, bankCode: string): Promise<string> {
    const r = await this.call('POST', '/transferrecipient', {
      data: { type: 'nuban', name, account_number: accountNumber, bank_code: bankCode, currency: 'NGN' },
    });
    const code = r.body?.data?.recipient_code;
    if (!r.ok || !code) throw new PaystackRejected(r.body?.message ?? 'Could not create recipient', r.httpStatus);
    return String(code);
  }

  /**
   * Starts the payout. `reference` must be lowercase letters, digits, - or _ (16-50 characters).
   * Retrying with the SAME reference never pays twice.
   */
  async initiateTransfer(p: {
    amountKobo: number;
    recipientCode: string;
    reference: string;
    reason: string;
  }): Promise<TransferReply> {
    const r = await this.call('POST', '/transfer', {
      data: {
        source: 'balance',
        amount: p.amountKobo,
        recipient: p.recipientCode,
        reference: p.reference,
        reason: p.reason,
      },
    });
    return {
      ok: r.ok,
      httpStatus: r.httpStatus,
      status: r.body?.data?.status != null ? String(r.body.data.status) : null,
      transferCode: r.body?.data?.transfer_code != null ? String(r.body.data.transfer_code) : null,
      message: r.body?.message != null ? String(r.body.message) : null,
    };
  }

  /** What really happened to a transfer. Returns null if Paystack has no such transfer. */
  async verifyTransfer(reference: string): Promise<string | null> {
    const r = await this.call('GET', `/transfer/verify/${encodeURIComponent(reference)}`);
    if (r.httpStatus === 404) return null;
    if (!r.ok) throw new PaystackUnknown(`Verify transfer answered ${r.httpStatus}`);
    const status = r.body?.data?.status;
    return status != null ? String(status) : null;
  }

  /** Your Paystack NGN balance in naira, or null if it can't be read. */
  async getBalance(): Promise<number | null> {
    try {
      const r = await this.call('GET', '/balance');
      if (!r.ok) return null;
      const ngn = (r.body?.data ?? []).find((b: any) => b?.currency === 'NGN');
      const kobo = Number(ngn?.balance);
      return Number.isFinite(kobo) ? kobo / 100 : null;
    } catch (err: any) {
      this.logger.warn(`Could not read Paystack balance: ${err?.message}`);
      return null;
    }
  }
}