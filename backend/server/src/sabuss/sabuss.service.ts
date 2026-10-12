import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export type SabussOutcome = 'SUCCESS' | 'PENDING' | 'FAILED' | 'REVERSED';

export interface SabussReply {
  code: string | null;
  status: string | null;
  response: string | null;
  reference: string | null;
}

export interface SabussPlan {
  planId: string;
  name: string;
  amount: number; // what Sabuss charges you (your cost)
}

// Sabuss codes: 200 success, 400 pending, 800 failed, 900 reversed.
// Anything else returns null: we never guess, we leave the order pending.
export function outcomeFromCode(code: string | null): SabussOutcome | null {
  switch (code) {
    case '200':
      return 'SUCCESS';
    case '400':
      return 'PENDING';
    case '800':
      return 'FAILED';
    case '900':
      return 'REVERSED';
    default:
      return null;
  }
}

@Injectable()
export class SabussService {
  private readonly logger = new Logger(SabussService.name);
  private readonly base = 'https://sabuss.com/vtu/api';
  private balanceCache: { value: number; at: number } | null = null;

  constructor(private http: HttpService) {}

  private get apiKey(): string {
    const key = process.env.SABUSS_API_KEY;
    if (!key) throw new Error('SABUSS_API_KEY is not set');
    return key;
  }

  private get accountPin(): string {
    const pin = process.env.SABUSS_PIN;
    if (!pin) throw new Error('SABUSS_PIN is not set');
    return pin;
  }

  // The API key is part of the URL, so this is the only place the URL is built
  // and errors are rethrown WITHOUT the axios config, so the key never reaches logs.
  private async post(path: string, fields: Record<string, string>): Promise<any> {
    const body = new URLSearchParams({ pin: this.accountPin, ...fields });
    try {
      const res = await firstValueFrom(
        this.http.post(`${this.base}/${path}/${encodeURIComponent(this.apiKey)}`, body.toString(), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 30_000,
          validateStatus: () => true, // read the body even on non-2xx
        }),
      );
      return res.data;
    } catch (err: any) {
      throw new Error(`Sabuss ${path} request failed: ${err?.code ?? err?.message ?? 'unknown error'}`);
    }
  }

  private toReply(data: any): SabussReply {
    const d = Array.isArray(data) ? data[0] : data;
    const o = d && typeof d === 'object' ? d : {};
    return {
      code: o.code != null ? String(o.code) : null,
      status: o.status != null ? String(o.status) : null,
      response: o.response != null ? String(o.response) : null,
      reference: o.reference != null ? String(o.reference) : null,
    };
  }

  /** Buy a data plan. `reference` is OUR unique id for this order. */
  async buyData(params: { planId: string; phone: string; reference: string }): Promise<SabussReply> {
    const data = await this.post('buy', {
      plan_id: params.planId,
      phone: params.phone,
      reference: params.reference,
    });
    return this.toReply(data);
  }

  /** Ask Sabuss what really happened to an order. */
  async query(reference: string): Promise<SabussReply> {
    const data = await this.post('query', { reference });
    return this.toReply(data);
  }

  async getPlans(category = 'data'): Promise<SabussPlan[]> {
    const data = await this.post('plans', { category });
    const list: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.plans)
          ? data.plans
          : [];

    return list
      .map((p) => ({
        planId: String(p?.plan_id ?? ''),
        name: String(p?.name ?? ''),
        amount: Number(String(p?.amount ?? '').replace(/,/g, '')),
      }))
      .filter((p) => p.planId && p.name && Number.isFinite(p.amount));
  }

  /** Your Sabuss wallet balance. Cached for 30s. Returns null if it can't be read. */
  async getBalance(): Promise<number | null> {
    const now = Date.now();
    if (this.balanceCache && now - this.balanceCache.at < 30_000) return this.balanceCache.value;

    const data = await this.post('balance', {});
    const raw = data?.balance ?? data?.data?.balance ?? data?.wallet ?? data;
    const n = Number(String(raw).replace(/,/g, ''));
    if (!Number.isFinite(n)) {
      this.logger.warn('Could not read Sabuss balance from response');
      return null;
    }
    this.balanceCache = { value: n, at: now };
    return n;
  }
}