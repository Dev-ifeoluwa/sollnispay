import { IsIn, IsInt, IsString, Length, Matches, Max, Min } from 'class-validator';

export class PurchaseAirtimeDto {
  @IsIn(['MTN', 'GLO', 'AIRTEL', '9MOBILE'], { message: 'Choose a valid network' })
  network: string;

  @Matches(/^0[789][01]\d{8}$/, { message: 'Enter a valid Nigerian phone number' })
  phone: string;

  /** Face value of the airtime in naira. Yangaplug's own minimum is 50. */
  @IsInt({ message: 'Amount must be a whole number' })
  @Min(50, { message: 'Minimum airtime is ₦50' })
  @Max(50000, { message: 'Maximum airtime per purchase is ₦50,000' })
  amount: number;

  @Matches(/^\d{4}$/, { message: 'PIN must be exactly 4 digits' })
  pin: string;

  /** Random id made by the frontend for each purchase attempt (e.g. crypto.randomUUID()).
   *  Sending the same one twice can never charge twice. */
  @IsString()
  @Length(8, 64)
  idempotencyKey: string;
}