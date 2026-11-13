// import { Injectable, Logger } from '@nestjs/common';
// import { HttpService } from '@nestjs/axios';
// import { firstValueFrom } from 'rxjs';

// // Same three outcomes your settlement code already understands.
// // Yangaplug documents no "reversed" status, so there is no REVERSED here.
// export type YangaplugOutcome = 'SUCCESS' | 'PENDING' | 'FAILED';

// export interface YangaplugReply {
//   outcome: YangaplugOutcome;
//   status: string | null; // raw Yangaplug payment status: created | successful | failed
//   message: string | null; // provider message or providers_response
//   reference: string | null; // OUR request_id
//   providerId: string | null; // Yangaplug's own payment id
//   balanceAfter: number | null; // your Yangaplug wallet balance after the order
//   httpStatus: number | null;
// }

// export interface YangaplugPlan {
//   planId: string; // "<billerCode>:<productCode>", e.g. "mtn_data:6295"
//   billerCode: string; // network, e.g. "mtn_data"
//   productCode: string;
//   name: string;
//   amount: number; // what Yangaplug charges you (your cost)
//   sizeMb: number | null;
// }

// export interface YangaplugBiller {
//   code: string;
//   name: string;
//   hasProducts: boolean;
//   isActive: boolean;
//   isResolvable: boolean; // true = the customer (smartcard / meter) can be verified before paying
//   requiresPhoneNo: boolean; // true = a customer phone number must be sent with the payment
//   imageUrl: string | null;
//   minimum: number | null;
//   maximum: number | null;
// }

// export interface YangaplugCustomer {
//   valid: boolean;
//   customerName: string | null;
//   message: string | null;
//   httpStatus: number;
// }

// // ---------- cards ----------

// export interface YangaplugKyc {
//   bvn: string;
//   dob: string; // YYYY-MM-DD
//   id_type: 'NIN' | 'PASSPORT' | 'VOTERS_CARD' | 'DRIVERS_LICENSE';
//   id_number: string;
//   id_image: string; // https URL
//   address_line_1: string;
//   city: string;
//   state: string;
//   country: string;
//   postal_code: string;
//   selfie_image: string; // https URL
// }

// export interface YangaplugCardholder {
//   id: string;
//   email: string | null;
//   kycVerified: boolean;
// }

// export type EnrollCardholderResult =
//   | { ok: true; cardholder: YangaplugCardholder }
//   | { ok: false; message: string | null; httpStatus: number };

// class YangaplugNetworkError extends Error {}

// // Yangaplug statuses: created (in progress), successful, failed.
// // Anything else returns null: we never guess, the order stays pending.
// export function outcomeFromStatus(status: string | null): YangaplugOutcome | null {
//   switch ((status ?? '').trim().toLowerCase()) {
//     case 'successful':
//       return 'SUCCESS';
//     case 'failed':
//       return 'FAILED';
//     case 'created':
//       return 'PENDING';
//     default:
//       return null;
//   }
// }

// @Injectable()
// export class YangaplugService {
//   private readonly logger = new Logger(YangaplugService.name);

//   private billersCache = new Map<string, { at: number; list: YangaplugBiller[] }>();
//   private productsCache = new Map<string, { at: number; plans: YangaplugPlan[] }>();
//   private readonly BILLERS_TTL = 10 * 60_000;
//   private readonly PRODUCTS_TTL = 5 * 60_000;

//   constructor(private http: HttpService) {}

//   // Defaults to LIVE. Anything that runs without YANGAPLUG_BASE_URL set spends real money.
//   // For testing: YANGAPLUG_BASE_URL=https://sandbox-api.yangaplugbusiness.com/api/v1
//   private get base(): string {
//     const url = process.env.YANGAPLUG_BASE_URL || 'https://api.yangaplugbusiness.com/api/v1';
//     return url.replace(/\/+$/, '');
//   }

//   private get secretKey(): string {
//     const key = process.env.YANGAPLUG_SECRET_KEY;
//     if (!key) throw new Error('YANGAPLUG_SECRET_KEY is not set');
//     return key;
//   }

//   // Single place where requests are made. Errors are rethrown WITHOUT the axios
//   // config so the Authorization header never reaches logs.
//   private async request(
//     method: 'GET' | 'POST' | 'PATCH',
//     path: string,
//     opts: { params?: Record<string, string>; body?: Record<string, unknown> } = {},
//   ): Promise<{ httpStatus: number; data: any }> {
//     try {
//       const res = await firstValueFrom(
//         this.http.request({
//           method,
//           url: `${this.base}${path}`,
//           params: opts.params,
//           data: opts.body,
//           headers: {
//             Authorization: `Bearer ${this.secretKey}`,
//             Accept: 'application/json',
//             ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
//           },
//           timeout: 30_000,
//           validateStatus: () => true, // read the body even on non-2xx
//         }),
//       );
//       return { httpStatus: res.status, data: res.data };
//     } catch (err: any) {
//       throw new YangaplugNetworkError(
//         `Yangaplug ${method} ${path} failed: ${err?.code ?? err?.message ?? 'unknown error'}`,
//       );
//     }
//   }

//   private ok(httpStatus: number, data: any): boolean {
//     return httpStatus >= 200 && httpStatus < 300 && data?.success === true;
//   }

//   private str(v: unknown): string | null {
//     return v != null ? String(v) : null;
//   }

//   private fromPayment(
//     payment: any,
//     httpStatus: number,
//     fallbackMessage: string | null,
//     reference: string,
//   ): YangaplugReply {
//     const status = this.str(payment?.status);
//     let outcome = outcomeFromStatus(status);
//     if (!outcome) {
//       this.logger.warn(`Unknown Yangaplug status "${status}" for ${reference}, leaving PENDING`);
//       outcome = 'PENDING';
//     }
//     const bal = Number(payment?.balance_after);
//     return {
//       outcome,
//       status,
//       message: this.str(payment?.providers_response) ?? fallbackMessage,
//       reference: this.str(payment?.request_id) ?? reference,
//       providerId: this.str(payment?.id),
//       balanceAfter: Number.isFinite(bal) ? bal : null,
//       httpStatus,
//     };
//   }

//   // ---------- plans ----------

//   async getBillers(category = 'data_bundle'): Promise<YangaplugBiller[]> {
//     const now = Date.now();
//     const cached = this.billersCache.get(category);
//     if (cached && now - cached.at < this.BILLERS_TTL) return cached.list;

//     const { httpStatus, data } = await this.request('GET', `/bill-payments/billers/${encodeURIComponent(category)}`);
//     if (!this.ok(httpStatus, data) || !Array.isArray(data?.data?.billers)) {
//       throw new Error(`Yangaplug billers failed: HTTP ${httpStatus} ${data?.message ?? ''}`.trim());
//     }

//     const list: YangaplugBiller[] = data.data.billers
//       .map((b: any) => ({
//         code: String(b?.code ?? ''),
//         name: String(b?.name ?? ''),
//         hasProducts: b?.has_products === true,
//         isActive: b?.is_active !== false,
//         isResolvable: b?.is_resolvable === true,
//         requiresPhoneNo: b?.requires_phone_no === true,
//         imageUrl: this.str(b?.image_url),
//         minimum: Number.isFinite(Number(b?.minimum)) ? Number(b.minimum) : null,
//         maximum: Number.isFinite(Number(b?.maximum)) ? Number(b.maximum) : null,
//       }))
//       .filter((b: YangaplugBiller) => b.code);

//     this.billersCache.set(category, { at: now, list });
//     return list;
//   }

//   private async getProducts(billerCode: string): Promise<YangaplugPlan[]> {
//     const now = Date.now();
//     const hit = this.productsCache.get(billerCode);
//     if (hit && now - hit.at < this.PRODUCTS_TTL) return hit.plans;

//     const { httpStatus, data } = await this.request(
//       'GET',
//       `/bill-payments/products/${encodeURIComponent(billerCode)}`,
//     );
//     if (!this.ok(httpStatus, data) || !Array.isArray(data?.data?.products)) {
//       throw new Error(`Yangaplug products (${billerCode}) failed: HTTP ${httpStatus} ${data?.message ?? ''}`.trim());
//     }

//     const plans: YangaplugPlan[] = data.data.products
//       .filter((p: any) => p?.is_active !== false)
//       .map((p: any) => {
//         const size = Number(p?.value);
//         return {
//           planId: `${billerCode}:${String(p?.code ?? '')}`,
//           billerCode,
//           productCode: String(p?.code ?? ''),
//           name: String(p?.name ?? ''),
//           amount: Number(String(p?.amount ?? '').replace(/,/g, '')),
//           sizeMb: Number.isFinite(size) ? size : null,
//         };
//       })
//       .filter((p: YangaplugPlan) => p.productCode && p.name && Number.isFinite(p.amount) && p.amount > 0);

//     this.productsCache.set(billerCode, { at: now, plans });
//     return plans;
//   }

//   /** Data plans for one network (pass its biller code, e.g. "mtn_data"), or for every active data network. */
//   async getPlans(billerCode?: string): Promise<YangaplugPlan[]> {
//     const codes = billerCode
//       ? [billerCode]
//       : (await this.getBillers('data_bundle')).filter((b) => b.isActive && b.hasProducts).map((b) => b.code);

//     const lists = await Promise.all(codes.map((c) => this.getProducts(c)));
//     return lists.flat();
//   }

//   // ---------- purchase ----------

//   private splitPlanId(planId: string): { billerCode: string; productCode: string } {
//     const i = planId.indexOf(':');
//     const billerCode = i > 0 ? planId.slice(0, i) : '';
//     const productCode = i > 0 ? planId.slice(i + 1) : '';
//     if (!billerCode || !productCode) throw new Error(`Invalid Yangaplug planId: ${planId}`);
//     return { billerCode, productCode };
//   }

//   /** Buy a data plan. `reference` is OUR unique id for this order (sent as request_id). */
//   async buyData(params: {
//     planId: string;
//     phone: string;
//     reference: string;
//     ported?: boolean;
//   }): Promise<YangaplugReply> {
//     const { billerCode, productCode } = this.splitPlanId(params.planId);
//     return this.pay(params.reference, {
//       request_id: params.reference,
//       biller_code: billerCode,
//       product_code: productCode,
//       recipient: params.phone,
//       // amount is omitted on purpose: for fixed-price products Yangaplug uses the product amount
//       sync: true,
//       ported: params.ported ?? false,
//     });
//   }

//   /**
//    * Buy airtime. Airtime billers have no products, so there is no product_code:
//    * the amount is what gets sent. biller code is e.g. "mtn_airtime".
//    */
//   async buyAirtime(params: {
//     billerCode: string;
//     phone: string;
//     amount: number;
//     reference: string;
//     ported?: boolean;
//   }): Promise<YangaplugReply> {
//     return this.pay(params.reference, {
//       request_id: params.reference,
//       biller_code: params.billerCode,
//       recipient: params.phone,
//       amount: params.amount,
//       sync: true,
//       ported: params.ported ?? false,
//     });
//   }

//   /**
//    * Check a smartcard / IUC / meter number BEFORE taking money.
//    *  - returns { valid: false } only when Yangaplug answers with a clear JSON error (number not found)
//    *  - THROWS when we could not get a real answer (network, 5xx, bad key, firewall page), so the caller
//    *    can say "try again" instead of telling a customer their number is wrong.
//    */
//   async validateCustomer(billerCode: string, recipient: string): Promise<YangaplugCustomer> {
//     const { httpStatus, data } = await this.request('POST', '/bill-payments/validate-customer', {
//       body: { biller_code: billerCode, recipient },
//     });
//     this.logger.debug(`validate ${billerCode} -> HTTP ${httpStatus}`); // the customer's name is not logged

//     if (this.ok(httpStatus, data)) {
//       const name = this.str(data?.data?.customer_name)?.trim() || null;
//       return { valid: !!name, customerName: name, message: this.str(data?.message), httpStatus };
//     }

//     const clearJsonError =
//       data && typeof data === 'object' && data.success === false &&
//       httpStatus >= 400 && httpStatus < 500 && ![401, 403, 408, 429].includes(httpStatus);
//     if (clearJsonError) {
//       return { valid: false, customerName: null, message: this.str(data?.message), httpStatus };
//     }

//     throw new Error(`Yangaplug validate-customer unavailable: HTTP ${httpStatus}`);
//   }

//   /**
//    * Pay a cable TV subscription. `smartcard` is the IUC / smartcard number.
//    * The amount is omitted on purpose: Yangaplug uses the product's own price.
//    */
//   async buyCableTv(params: {
//     billerCode: string;
//     productCode: string;
//     smartcard: string;
//     phone?: string; // only when the biller has requires_phone_no = true
//     reference: string;
//   }): Promise<YangaplugReply> {
//     return this.pay(params.reference, {
//       request_id: params.reference,
//       biller_code: params.billerCode,
//       product_code: params.productCode,
//       recipient: params.smartcard,
//       ...(params.phone ? { phone: params.phone } : {}),
//       sync: true,
//     });
//   }

//   // ---------- cardholders ----------

//   private toCardholder(c: any): YangaplugCardholder {
//     return {
//       id: String(c?.id ?? ''),
//       email: this.str(c?.email),
//       kycVerified: c?.kyc_verified === true,
//     };
//   }

//   /** Find a cardholder by email. Returns null if there is none. THROWS if we could not get a real answer. */
//   async findCardholderByEmail(email: string): Promise<YangaplugCardholder | null> {
//     // The docs show email as a GET body field. We also send it as a query param in case the server ignores the body.
//     const { httpStatus, data } = await this.request('GET', '/issuing/cardholders', {
//       params: { email },
//       body: { email },
//     });
//     const rows = data?.data?.cardholders?.data;
//     if (!this.ok(httpStatus, data) || !Array.isArray(rows)) {
//       throw new Error(`Yangaplug cardholder lookup failed: HTTP ${httpStatus}`);
//     }
//     const hit = rows.find((r: any) => String(r?.email ?? '').toLowerCase() === email.toLowerCase());
//     return hit ? this.toCardholder(hit) : null;
//   }

//   /**
//    * Enroll a cardholder. KYC details are never logged.
//    *  - { ok: false } when Yangaplug clearly rejected the request (bad BVN, bad ID, validation...)
//    *  - THROWS when we could not get a real answer (network, 5xx, bad key), so the caller says "try again"
//    */
//   async enrollCardholder(params: {
//     firstName: string;
//     middleName?: string;
//     lastName: string;
//     email: string;
//     phone: string;
//     kyc: YangaplugKyc;
//   }): Promise<EnrollCardholderResult> {
//     const { httpStatus, data } = await this.request('POST', '/issuing/cardholders', {
//       body: {
//         first_name: params.firstName,
//         ...(params.middleName ? { middle_name: params.middleName } : {}),
//         last_name: params.lastName,
//         email: params.email,
//         phone_number: params.phone,
//         kyc: params.kyc,
//       },
//     });

//     if (this.ok(httpStatus, data) && data?.data?.cardholder?.id) {
//       return { ok: true, cardholder: this.toCardholder(data.data.cardholder) };
//     }

//     // The docs show an empty body for 400, so any clear 4xx counts as a rejection even without a message.
//     if (httpStatus >= 400 && httpStatus < 500 && ![401, 403, 408, 429].includes(httpStatus)) {
//       this.logger.warn(`Cardholder enrollment rejected: HTTP ${httpStatus} ${this.str(data?.message) ?? ''}`.trim());
//       return { ok: false, message: this.str(data?.message), httpStatus };
//     }
//     if (httpStatus === 401 || httpStatus === 403) {
//       this.logger.error(`Yangaplug rejected our credentials (HTTP ${httpStatus}). Check YANGAPLUG_SECRET_KEY`);
//     }
//     throw new Error(`Yangaplug enroll cardholder unavailable: HTTP ${httpStatus}`);
//   }

//   /**
//    * One place that sends a payment and reads the answer. Never throws for provider or network problems.
//    *  - FAILED  only when Yangaplug clearly rejected the request (4xx, nothing was delivered)
//    *  - PENDING for timeouts, 5xx, 409, "created", or anything we do not recognise
//    */
//   private async pay(reference: string, body: Record<string, unknown>): Promise<YangaplugReply> {
//     let res: { httpStatus: number; data: any };
//     try {
//       res = await this.request('POST', '/bill-payments/pay', { body });
//     } catch (err: any) {
//       // Timeout / network failure: the order may or may not have gone through. Never treat as failed.
//       this.logger.warn(`${err.message} (ref ${reference}), leaving PENDING`);
//       return {
//         outcome: 'PENDING',
//         status: null,
//         message: err.message,
//         reference,
//         providerId: null,
//         balanceAfter: null,
//         httpStatus: null,
//       };
//     }

//     const { httpStatus, data } = res;
//     this.logger.debug(`pay ${reference} -> HTTP ${httpStatus} ${JSON.stringify(data)}`);
//     const message = this.str(data?.message);

//     // Accepted: read the payment status
//     if (this.ok(httpStatus, data) && data?.data?.payment) {
//       return this.fromPayment(data.data.payment, httpStatus, message, reference);
//     }

//     // Rejected before processing (validation, insufficient balance, bad key...): nothing was delivered.
//     // 408 (timeout) and 409 (conflict / duplicate) are ambiguous, so they stay PENDING.
//     if (httpStatus >= 400 && httpStatus < 500 && httpStatus !== 408 && httpStatus !== 409) {
//       if (httpStatus === 401 || httpStatus === 403) {
//         this.logger.error(`Yangaplug rejected our credentials (HTTP ${httpStatus}). Check YANGAPLUG_SECRET_KEY`);
//       }
//       return {
//         outcome: 'FAILED',
//         status: 'rejected',
//         message,
//         reference,
//         providerId: null,
//         balanceAfter: null,
//         httpStatus,
//       };
//     }

//     // 5xx, 409, or a 2xx we cannot read: unknown, never guess.
//     this.logger.warn(`Unclear Yangaplug reply for ${reference} (HTTP ${httpStatus}), leaving PENDING`);
//     return {
//       outcome: 'PENDING',
//       status: null,
//       message,
//       reference,
//       providerId: null,
//       balanceAfter: null,
//       httpStatus,
//     };
//   }

//   /** Ask Yangaplug what really happened to an order, by OUR request_id. */
//   async query(reference: string): Promise<YangaplugReply> {
//     let res: { httpStatus: number; data: any };
//     try {
//       res = await this.request('GET', '/bill-payments/requery', { params: { request_id: reference } });
//     } catch (err: any) {
//       this.logger.warn(`${err.message} (requery ${reference}), leaving PENDING`);
//       return {
//         outcome: 'PENDING',
//         status: null,
//         message: err.message,
//         reference,
//         providerId: null,
//         balanceAfter: null,
//         httpStatus: null,
//       };
//     }

//     const { httpStatus, data } = res;
//     this.logger.debug(`requery ${reference} -> HTTP ${httpStatus} ${JSON.stringify(data)}`);
//     const message = this.str(data?.message);

//     if (this.ok(httpStatus, data) && data?.data?.payment) {
//       return this.fromPayment(data.data.payment, httpStatus, message, reference);
//     }

//     // A failed LOOKUP (404, 5xx, ...) says nothing about the payment itself: stay PENDING.
//     return {
//       outcome: 'PENDING',
//       status: null,
//       message,
//       reference,
//       providerId: null,
//       balanceAfter: null,
//       httpStatus,
//     };
//   }
// }






import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// Same three outcomes your settlement code already understands.
// Yangaplug documents no "reversed" status, so there is no REVERSED here.
export type YangaplugOutcome = 'SUCCESS' | 'PENDING' | 'FAILED';

export interface YangaplugReply {
  outcome: YangaplugOutcome;
  status: string | null; // raw Yangaplug payment status: created | successful | failed
  message: string | null; // provider message or providers_response
  reference: string | null; // OUR request_id
  providerId: string | null; // Yangaplug's own payment id
  balanceAfter: number | null; // your Yangaplug wallet balance after the order
  httpStatus: number | null;
}

export interface YangaplugPlan {
  planId: string; // "<billerCode>:<productCode>", e.g. "mtn_data:6295"
  billerCode: string; // network, e.g. "mtn_data"
  productCode: string;
  name: string;
  amount: number; // what Yangaplug charges you (your cost)
  sizeMb: number | null;
}

export interface YangaplugBiller {
  code: string;
  name: string;
  hasProducts: boolean;
  isActive: boolean;
  isResolvable: boolean; // true = the customer (smartcard / meter) can be verified before paying
  requiresPhoneNo: boolean; // true = a customer phone number must be sent with the payment
  imageUrl: string | null;
  minimum: number | null;
  maximum: number | null;
}

export interface YangaplugCustomer {
  valid: boolean;
  customerName: string | null;
  message: string | null;
  httpStatus: number;
}

// ---------- cards ----------

export interface YangaplugKyc {
  bvn: string;
  dob: string; // YYYY-MM-DD
  id_type: 'NIN' | 'PASSPORT' | 'VOTERS_CARD' | 'DRIVERS_LICENSE';
  id_number: string;
  id_image: string; // https URL
  address_line_1: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  selfie_image: string; // https URL
}

export interface YangaplugCardholder {
  id: string;
  email: string | null;
  kycVerified: boolean;
}

export type EnrollCardholderResult =
  | { ok: true; cardholder: YangaplugCardholder }
  | { ok: false; message: string | null; httpStatus: number };

export type CreateCardResult =
  | { ok: true; cardId: string | null }
  | { ok: false; message: string | null; httpStatus: number };

export type FundCardOutcome = 'SUCCESS' | 'REJECTED' | 'UNKNOWN';

export interface FundCardResult {
  outcome: FundCardOutcome;
  message: string | null;
  httpStatus: number | null;
}

class YangaplugNetworkError extends Error {}

// Yangaplug statuses: created (in progress), successful, failed.
// Anything else returns null: we never guess, the order stays pending.
export function outcomeFromStatus(status: string | null): YangaplugOutcome | null {
  switch ((status ?? '').trim().toLowerCase()) {
    case 'successful':
      return 'SUCCESS';
    case 'failed':
      return 'FAILED';
    case 'created':
      return 'PENDING';
    default:
      return null;
  }
}

@Injectable()
export class YangaplugService {
  private readonly logger = new Logger(YangaplugService.name);

  private billersCache = new Map<string, { at: number; list: YangaplugBiller[] }>();
  private productsCache = new Map<string, { at: number; plans: YangaplugPlan[] }>();
  private readonly BILLERS_TTL = 10 * 60_000;
  private readonly PRODUCTS_TTL = 5 * 60_000;

  constructor(private http: HttpService) {}

  // Defaults to LIVE. Anything that runs without YANGAPLUG_BASE_URL set spends real money.
  // For testing: YANGAPLUG_BASE_URL=https://sandbox-api.yangaplugbusiness.com/api/v1
  private get base(): string {
    const url = process.env.YANGAPLUG_BASE_URL || 'https://api.yangaplugbusiness.com/api/v1';
    return url.replace(/\/+$/, '');
  }

  private get secretKey(): string {
    const key = process.env.YANGAPLUG_SECRET_KEY;
    if (!key) throw new Error('YANGAPLUG_SECRET_KEY is not set');
    return key;
  }

  // Single place where requests are made. Errors are rethrown WITHOUT the axios
  // config so the Authorization header never reaches logs.
  private async request(
    method: 'GET' | 'POST' | 'PATCH',
    path: string,
    opts: { params?: Record<string, string>; body?: Record<string, unknown> } = {},
  ): Promise<{ httpStatus: number; data: any }> {
    try {
      const res = await firstValueFrom(
        this.http.request({
          method,
          url: `${this.base}${path}`,
          params: opts.params,
          data: opts.body,
          headers: {
            Authorization: `Bearer ${this.secretKey}`,
            Accept: 'application/json',
            ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
          },
          timeout: 30_000,
          validateStatus: () => true, // read the body even on non-2xx
        }),
      );
      return { httpStatus: res.status, data: res.data };
    } catch (err: any) {
      throw new YangaplugNetworkError(
        `Yangaplug ${method} ${path} failed: ${err?.code ?? err?.message ?? 'unknown error'}`,
      );
    }
  }

  private ok(httpStatus: number, data: any): boolean {
    return httpStatus >= 200 && httpStatus < 300 && data?.success === true;
  }

  private str(v: unknown): string | null {
    return v != null ? String(v) : null;
  }

  private fromPayment(
    payment: any,
    httpStatus: number,
    fallbackMessage: string | null,
    reference: string,
  ): YangaplugReply {
    const status = this.str(payment?.status);
    let outcome = outcomeFromStatus(status);
    if (!outcome) {
      this.logger.warn(`Unknown Yangaplug status "${status}" for ${reference}, leaving PENDING`);
      outcome = 'PENDING';
    }
    const bal = Number(payment?.balance_after);
    return {
      outcome,
      status,
      message: this.str(payment?.providers_response) ?? fallbackMessage,
      reference: this.str(payment?.request_id) ?? reference,
      providerId: this.str(payment?.id),
      balanceAfter: Number.isFinite(bal) ? bal : null,
      httpStatus,
    };
  }

  // ---------- plans ----------

  async getBillers(category = 'data_bundle'): Promise<YangaplugBiller[]> {
    const now = Date.now();
    const cached = this.billersCache.get(category);
    if (cached && now - cached.at < this.BILLERS_TTL) return cached.list;

    const { httpStatus, data } = await this.request('GET', `/bill-payments/billers/${encodeURIComponent(category)}`);
    if (!this.ok(httpStatus, data) || !Array.isArray(data?.data?.billers)) {
      throw new Error(`Yangaplug billers failed: HTTP ${httpStatus} ${data?.message ?? ''}`.trim());
    }

    const list: YangaplugBiller[] = data.data.billers
      .map((b: any) => ({
        code: String(b?.code ?? ''),
        name: String(b?.name ?? ''),
        hasProducts: b?.has_products === true,
        isActive: b?.is_active !== false,
        isResolvable: b?.is_resolvable === true,
        requiresPhoneNo: b?.requires_phone_no === true,
        imageUrl: this.str(b?.image_url),
        minimum: Number.isFinite(Number(b?.minimum)) ? Number(b.minimum) : null,
        maximum: Number.isFinite(Number(b?.maximum)) ? Number(b.maximum) : null,
      }))
      .filter((b: YangaplugBiller) => b.code);

    this.billersCache.set(category, { at: now, list });
    return list;
  }

  private async getProducts(billerCode: string): Promise<YangaplugPlan[]> {
    const now = Date.now();
    const hit = this.productsCache.get(billerCode);
    if (hit && now - hit.at < this.PRODUCTS_TTL) return hit.plans;

    const { httpStatus, data } = await this.request(
      'GET',
      `/bill-payments/products/${encodeURIComponent(billerCode)}`,
    );
    if (!this.ok(httpStatus, data) || !Array.isArray(data?.data?.products)) {
      throw new Error(`Yangaplug products (${billerCode}) failed: HTTP ${httpStatus} ${data?.message ?? ''}`.trim());
    }

    const plans: YangaplugPlan[] = data.data.products
      .filter((p: any) => p?.is_active !== false)
      .map((p: any) => {
        const size = Number(p?.value);
        return {
          planId: `${billerCode}:${String(p?.code ?? '')}`,
          billerCode,
          productCode: String(p?.code ?? ''),
          name: String(p?.name ?? ''),
          amount: Number(String(p?.amount ?? '').replace(/,/g, '')),
          sizeMb: Number.isFinite(size) ? size : null,
        };
      })
      .filter((p: YangaplugPlan) => p.productCode && p.name && Number.isFinite(p.amount) && p.amount > 0);

    this.productsCache.set(billerCode, { at: now, plans });
    return plans;
  }

  /** Data plans for one network (pass its biller code, e.g. "mtn_data"), or for every active data network. */
  async getPlans(billerCode?: string): Promise<YangaplugPlan[]> {
    const codes = billerCode
      ? [billerCode]
      : (await this.getBillers('data_bundle')).filter((b) => b.isActive && b.hasProducts).map((b) => b.code);

    const lists = await Promise.all(codes.map((c) => this.getProducts(c)));
    return lists.flat();
  }

  // ---------- purchase ----------

  private splitPlanId(planId: string): { billerCode: string; productCode: string } {
    const i = planId.indexOf(':');
    const billerCode = i > 0 ? planId.slice(0, i) : '';
    const productCode = i > 0 ? planId.slice(i + 1) : '';
    if (!billerCode || !productCode) throw new Error(`Invalid Yangaplug planId: ${planId}`);
    return { billerCode, productCode };
  }

  /** Buy a data plan. `reference` is OUR unique id for this order (sent as request_id). */
  async buyData(params: {
    planId: string;
    phone: string;
    reference: string;
    ported?: boolean;
  }): Promise<YangaplugReply> {
    const { billerCode, productCode } = this.splitPlanId(params.planId);
    return this.pay(params.reference, {
      request_id: params.reference,
      biller_code: billerCode,
      product_code: productCode,
      recipient: params.phone,
      // amount is omitted on purpose: for fixed-price products Yangaplug uses the product amount
      sync: true,
      ported: params.ported ?? false,
    });
  }

  /**
   * Buy airtime. Airtime billers have no products, so there is no product_code:
   * the amount is what gets sent. biller code is e.g. "mtn_airtime".
   */
  async buyAirtime(params: {
    billerCode: string;
    phone: string;
    amount: number;
    reference: string;
    ported?: boolean;
  }): Promise<YangaplugReply> {
    return this.pay(params.reference, {
      request_id: params.reference,
      biller_code: params.billerCode,
      recipient: params.phone,
      amount: params.amount,
      sync: true,
      ported: params.ported ?? false,
    });
  }

  /**
   * Check a smartcard / IUC / meter number BEFORE taking money.
   *  - returns { valid: false } only when Yangaplug answers with a clear JSON error (number not found)
   *  - THROWS when we could not get a real answer (network, 5xx, bad key, firewall page), so the caller
   *    can say "try again" instead of telling a customer their number is wrong.
   */
  async validateCustomer(billerCode: string, recipient: string): Promise<YangaplugCustomer> {
    const { httpStatus, data } = await this.request('POST', '/bill-payments/validate-customer', {
      body: { biller_code: billerCode, recipient },
    });
    this.logger.debug(`validate ${billerCode} -> HTTP ${httpStatus}`); // the customer's name is not logged

    if (this.ok(httpStatus, data)) {
      const name = this.str(data?.data?.customer_name)?.trim() || null;
      return { valid: !!name, customerName: name, message: this.str(data?.message), httpStatus };
    }

    const clearJsonError =
      data && typeof data === 'object' && data.success === false &&
      httpStatus >= 400 && httpStatus < 500 && ![401, 403, 408, 429].includes(httpStatus);
    if (clearJsonError) {
      return { valid: false, customerName: null, message: this.str(data?.message), httpStatus };
    }

    throw new Error(`Yangaplug validate-customer unavailable: HTTP ${httpStatus}`);
  }

  /**
   * Pay a cable TV subscription. `smartcard` is the IUC / smartcard number.
   * The amount is omitted on purpose: Yangaplug uses the product's own price.
   */
  async buyCableTv(params: {
    billerCode: string;
    productCode: string;
    smartcard: string;
    phone?: string; // only when the biller has requires_phone_no = true
    reference: string;
  }): Promise<YangaplugReply> {
    return this.pay(params.reference, {
      request_id: params.reference,
      biller_code: params.billerCode,
      product_code: params.productCode,
      recipient: params.smartcard,
      ...(params.phone ? { phone: params.phone } : {}),
      sync: true,
    });
  }

  // ---------- cardholders ----------

  private toCardholder(c: any): YangaplugCardholder {
    return {
      id: String(c?.id ?? ''),
      email: this.str(c?.email),
      kycVerified: c?.kyc_verified === true,
    };
  }

  /** Find a cardholder by email. Returns null if there is none. THROWS if we could not get a real answer. */
  async findCardholderByEmail(email: string): Promise<YangaplugCardholder | null> {
    // The docs show email as a GET body field. We also send it as a query param in case the server ignores the body.
    const { httpStatus, data } = await this.request('GET', '/issuing/cardholders', {
      params: { email },
      body: { email },
    });
    const rows = data?.data?.cardholders?.data;
    if (!this.ok(httpStatus, data) || !Array.isArray(rows)) {
      throw new Error(`Yangaplug cardholder lookup failed: HTTP ${httpStatus}`);
    }
    const hit = rows.find((r: any) => String(r?.email ?? '').toLowerCase() === email.toLowerCase());
    return hit ? this.toCardholder(hit) : null;
  }

  /**
   * Enroll a cardholder. KYC details are never logged.
   *  - { ok: false } when Yangaplug clearly rejected the request (bad BVN, bad ID, validation...)
   *  - THROWS when we could not get a real answer (network, 5xx, bad key), so the caller says "try again"
   */
  async enrollCardholder(params: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    phone: string;
    kyc: YangaplugKyc;
  }): Promise<EnrollCardholderResult> {
    const { httpStatus, data } = await this.request('POST', '/issuing/cardholders', {
      body: {
        first_name: params.firstName,
        ...(params.middleName ? { middle_name: params.middleName } : {}),
        last_name: params.lastName,
        email: params.email,
        phone_number: params.phone,
        kyc: params.kyc,
      },
    });

    if (this.ok(httpStatus, data) && data?.data?.cardholder?.id) {
      return { ok: true, cardholder: this.toCardholder(data.data.cardholder) };
    }

    // The docs show an empty body for 400, so any clear 4xx counts as a rejection even without a message.
    if (httpStatus >= 400 && httpStatus < 500 && ![401, 403, 408, 429].includes(httpStatus)) {
      this.logger.warn(`Cardholder enrollment rejected: HTTP ${httpStatus} ${this.str(data?.message) ?? ''}`.trim());
      return { ok: false, message: this.str(data?.message), httpStatus };
    }
    if (httpStatus === 401 || httpStatus === 403) {
      this.logger.error(`Yangaplug rejected our credentials (HTTP ${httpStatus}). Check YANGAPLUG_SECRET_KEY`);
    }
    throw new Error(`Yangaplug enroll cardholder unavailable: HTTP ${httpStatus}`);
  }

  // ---------- cards ----------

  /**
   * Issue a virtual USD card. The docs say this is asynchronous: the final status arrives by webhook.
   *  - { ok: true, cardId } when accepted (cardId is null if the reply does not include one yet)
   *  - { ok: false } when Yangaplug clearly rejected the request
   *  - THROWS when we could not get a real answer (network, 5xx, 409, unreadable reply)
   */
  async createCard(params: {
    cardholderId: string;
    issuer: 'mastercard' | 'visa';
  }): Promise<CreateCardResult> {
    const { httpStatus, data } = await this.request('POST', '/issuing', {
      body: {
        cardholder_id: params.cardholderId,
        issuer: params.issuer,
        currency: 'usd',
        type: 'virtual',
      },
    });

    if (this.ok(httpStatus, data)) {
      const d = data?.data;
      return { ok: true, cardId: this.str(d?.card?.id ?? d?.id) };
    }

    if (httpStatus >= 400 && httpStatus < 500 && ![401, 403, 408, 409, 429].includes(httpStatus)) {
      this.logger.warn(`Create card rejected: HTTP ${httpStatus} ${this.str(data?.message) ?? ''}`.trim());
      return { ok: false, message: this.str(data?.message), httpStatus };
    }
    if (httpStatus === 401 || httpStatus === 403) {
      this.logger.error(`Yangaplug rejected our credentials (HTTP ${httpStatus}). Check YANGAPLUG_SECRET_KEY`);
    }
    throw new Error(`Yangaplug create card unavailable: HTTP ${httpStatus}`);
  }

  /**
   * Add USD to a card. There is no idempotency key in the docs, so the caller must NEVER retry on UNKNOWN.
   *  - SUCCESS  only on a clean 2xx with success = true
   *  - REJECTED only when Yangaplug clearly refused (nothing was added)
   *  - UNKNOWN  for timeouts, 5xx, 408/409, or any reply we cannot read: never guess
   */
  async fundCard(cardId: string, amountUsd: number): Promise<FundCardResult> {
    let res: { httpStatus: number; data: any };
    try {
      res = await this.request('POST', `/issuing/${encodeURIComponent(cardId)}/fund`, {
        body: { amount: amountUsd },
      });
    } catch (err: any) {
      this.logger.warn(`${err.message} (fund card), leaving PENDING`);
      return { outcome: 'UNKNOWN', message: err.message, httpStatus: null };
    }

    const { httpStatus, data } = res;
    const message = this.str(data?.message);
    this.logger.debug(`fund card -> HTTP ${httpStatus}`);

    if (this.ok(httpStatus, data)) return { outcome: 'SUCCESS', message, httpStatus };

    if (httpStatus >= 400 && httpStatus < 500 && httpStatus !== 408 && httpStatus !== 409) {
      if (httpStatus === 401 || httpStatus === 403) {
        this.logger.error(`Yangaplug rejected our credentials (HTTP ${httpStatus}). Check YANGAPLUG_SECRET_KEY`);
      }
      return { outcome: 'REJECTED', message, httpStatus };
    }
    this.logger.warn(`Unclear fund-card reply (HTTP ${httpStatus}), leaving PENDING`);
    return { outcome: 'UNKNOWN', message, httpStatus };
  }

  /**
   * One place that sends a payment and reads the answer. Never throws for provider or network problems.
   *  - FAILED  only when Yangaplug clearly rejected the request (4xx, nothing was delivered)
   *  - PENDING for timeouts, 5xx, 409, "created", or anything we do not recognise
   */
  private async pay(reference: string, body: Record<string, unknown>): Promise<YangaplugReply> {
    let res: { httpStatus: number; data: any };
    try {
      res = await this.request('POST', '/bill-payments/pay', { body });
    } catch (err: any) {
      // Timeout / network failure: the order may or may not have gone through. Never treat as failed.
      this.logger.warn(`${err.message} (ref ${reference}), leaving PENDING`);
      return {
        outcome: 'PENDING',
        status: null,
        message: err.message,
        reference,
        providerId: null,
        balanceAfter: null,
        httpStatus: null,
      };
    }

    const { httpStatus, data } = res;
    this.logger.debug(`pay ${reference} -> HTTP ${httpStatus} ${JSON.stringify(data)}`);
    const message = this.str(data?.message);

    // Accepted: read the payment status
    if (this.ok(httpStatus, data) && data?.data?.payment) {
      return this.fromPayment(data.data.payment, httpStatus, message, reference);
    }

    // Rejected before processing (validation, insufficient balance, bad key...): nothing was delivered.
    // 408 (timeout) and 409 (conflict / duplicate) are ambiguous, so they stay PENDING.
    if (httpStatus >= 400 && httpStatus < 500 && httpStatus !== 408 && httpStatus !== 409) {
      if (httpStatus === 401 || httpStatus === 403) {
        this.logger.error(`Yangaplug rejected our credentials (HTTP ${httpStatus}). Check YANGAPLUG_SECRET_KEY`);
      }
      return {
        outcome: 'FAILED',
        status: 'rejected',
        message,
        reference,
        providerId: null,
        balanceAfter: null,
        httpStatus,
      };
    }

    // 5xx, 409, or a 2xx we cannot read: unknown, never guess.
    this.logger.warn(`Unclear Yangaplug reply for ${reference} (HTTP ${httpStatus}), leaving PENDING`);
    return {
      outcome: 'PENDING',
      status: null,
      message,
      reference,
      providerId: null,
      balanceAfter: null,
      httpStatus,
    };
  }

  /** Ask Yangaplug what really happened to an order, by OUR request_id. */
  async query(reference: string): Promise<YangaplugReply> {
    let res: { httpStatus: number; data: any };
    try {
      res = await this.request('GET', '/bill-payments/requery', { params: { request_id: reference } });
    } catch (err: any) {
      this.logger.warn(`${err.message} (requery ${reference}), leaving PENDING`);
      return {
        outcome: 'PENDING',
        status: null,
        message: err.message,
        reference,
        providerId: null,
        balanceAfter: null,
        httpStatus: null,
      };
    }

    const { httpStatus, data } = res;
    this.logger.debug(`requery ${reference} -> HTTP ${httpStatus} ${JSON.stringify(data)}`);
    const message = this.str(data?.message);

    if (this.ok(httpStatus, data) && data?.data?.payment) {
      return this.fromPayment(data.data.payment, httpStatus, message, reference);
    }

    // A failed LOOKUP (404, 5xx, ...) says nothing about the payment itself: stay PENDING.
    return {
      outcome: 'PENDING',
      status: null,
      message,
      reference,
      providerId: null,
      balanceAfter: null,
      httpStatus,
    };
  }
}