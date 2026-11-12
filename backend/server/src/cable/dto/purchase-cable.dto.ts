import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class PurchaseCableDto {
  /** Yangaplug biller code from GET /cable/providers, e.g. "dstv_cable_tv" */
  @Matches(/^[a-z0-9_]{3,40}$/, { message: 'Choose a valid cable TV provider' })
  provider: string;

  /** Plan id from GET /cable/plans (looks like "dstv_cable_tv:6301"). NEVER a price. */
  @IsString()
  @Length(3, 80)
  planId: string;

  @Matches(/^\d{8,12}$/, { message: 'Enter a valid smartcard / IUC number' })
  smartcard: string;

  /** Only needed when the provider asks for a phone number (the server tells you if it does). */
  @IsOptional()
  @Matches(/^0[789][01]\d{8}$/, { message: 'Enter a valid Nigerian phone number' })
  phone?: string;

  @Matches(/^\d{4}$/, { message: 'PIN must be exactly 4 digits' })
  pin: string;

  /** Random id made by the frontend for each purchase attempt (e.g. crypto.randomUUID()).
   *  Sending the same one twice can never charge twice. */
  @IsString()
  @Length(8, 64)
  idempotencyKey: string;
}