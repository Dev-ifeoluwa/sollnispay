// import { Type } from 'class-transformer';
// import { IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

// // POST /transfers/resolve-wallet
// export class ResolveWalletDto {
//   @IsString()
//   @MaxLength(30)
//   identifier: string; // the recipient's phone number
// }

// // POST /transfers/wallet
// export class SendWalletDto {
//   @IsString()
//   @MaxLength(30)
//   identifier: string; // the recipient's phone number

//   @Type(() => Number)
//   @IsNumber({ maxDecimalPlaces: 2 })
//   @Min(1)
//   @Max(10_000_000)
//   amount: number;

//   @IsOptional()
//   @IsString()
//   @MaxLength(100)
//   narration?: string;

//   // adjust if your PINs are not 4-6 digits (the page sends 4)
//   @IsString()
//   @Matches(/^\d{4,6}$/, { message: 'PIN must be 4 to 6 digits' })
//   pin: string;

//   // the page makes one per attempt (crypto.randomUUID()) so a double tap can't send twice
//   @IsString()
//   @MinLength(8)
//   @MaxLength(100)
//   idempotencyKey: string;
// }





import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

// ---------- Sollnis wallet ----------

// POST /transfers/resolve-wallet
export class ResolveWalletDto {
  @IsString()
  @MaxLength(30)
  identifier: string; // the recipient's phone number
}

// POST /transfers/wallet
export class SendWalletDto {
  @IsString()
  @MaxLength(30)
  identifier: string; // the recipient's phone number

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(10_000_000)
  amount: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  narration?: string;

  // adjust if your PINs are not 4-6 digits (the page sends 4)
  @IsString()
  @Matches(/^\d{4,6}$/, { message: 'PIN must be 4 to 6 digits' })
  pin: string;

  // the page makes one per attempt (crypto.randomUUID()) so a double tap can't send twice
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  idempotencyKey: string;
}

// ---------- Other banks ----------

// POST /transfers/resolve-bank
export class ResolveBankDto {
  @IsString()
  @Matches(/^\d{10}$/, { message: 'Account number must be 10 digits' })
  accountNumber: string;

  @IsString()
  @MaxLength(20)
  bankCode: string;
}

// POST /transfers/bank
// The page also sends accountName, but the server ignores it (it is stripped by the
// ValidationPipe whitelist) and asks Paystack for the real name itself.
export class SendBankDto {
  @IsString()
  @MaxLength(20)
  bankCode: string;

  @IsString()
  @Matches(/^\d{10}$/, { message: 'Account number must be 10 digits' })
  accountNumber: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(10_000_000)
  amount: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  narration?: string;

  @IsString()
  @Matches(/^\d{4,6}$/, { message: 'PIN must be 4 to 6 digits' })
  pin: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  idempotencyKey: string;
}