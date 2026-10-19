import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Matches, Max, MaxLength, Min, MinLength } from 'class-validator';

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