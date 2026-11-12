import { Matches } from 'class-validator';

export class VerifyCableDto {
  /** Yangaplug biller code from GET /cable/providers, e.g. "dstv_cable_tv" */
  @Matches(/^[a-z0-9_]{3,40}$/, { message: 'Choose a valid cable TV provider' })
  provider: string;

  /** Smartcard / IUC number */
  @Matches(/^\d{8,12}$/, { message: 'Enter a valid smartcard / IUC number' })
  smartcard: string;
}