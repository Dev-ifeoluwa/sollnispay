import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SetPinDto {
  @Matches(/^\d{4}$/, { message: 'PIN must be exactly 4 digits' })
  pin!: string;
}

export class ChangePinDto {
  @Matches(/^\d{4}$/, { message: 'Current PIN must be exactly 4 digits' })
  currentPin!: string;

  @Matches(/^\d{4}$/, { message: 'New PIN must be exactly 4 digits' })
  newPin!: string;
}

export class ResetPinDto {
  @Matches(/^\d{6}$/, { message: 'Code must be exactly 6 digits' })
  otp!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password!: string;

  @Matches(/^\d{4}$/, { message: 'New PIN must be exactly 4 digits' })
  newPin!: string;
}