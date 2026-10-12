import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class PurchaseDataDto {
  /** Service.id of the plan (NOT the Sabuss plan id, and never a price) */
  @IsString()
  @IsNotEmpty()
  planId: string;

  @Matches(/^0[789][01]\d{8}$/, { message: 'Enter a valid Nigerian phone number' })
  phone: string;

  @Matches(/^\d{4}$/, { message: 'PIN must be exactly 4 digits' })
  pin: string;

  /** Random id made by the frontend for each purchase attempt (e.g. crypto.randomUUID()).
   *  Sending the same one twice can never charge twice. */
  @IsString()
  @Length(8, 64)
  idempotencyKey: string;
}