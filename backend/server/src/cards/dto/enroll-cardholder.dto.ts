import { IsDateString, IsIn, IsString, IsUrl, Length, Matches } from 'class-validator';

export class EnrollCardholderDto {
  @Matches(/^\d{11}$/, { message: 'BVN must be 11 digits' })
  bvn: string;

  @IsDateString()
  dob: string;

  @IsIn(['NIN', 'PASSPORT', 'VOTERS_CARD', 'DRIVERS_LICENSE'])
  id_type: 'NIN' | 'PASSPORT' | 'VOTERS_CARD' | 'DRIVERS_LICENSE';

  @IsString() @Length(5, 30)
  id_number: string;

  @IsUrl({ protocols: ['https'], require_protocol: true })
  id_image: string;

  @IsString() @Length(3, 120)
  address_line_1: string;

  @IsString() @Length(2, 60)
  city: string;

  @IsString() @Length(2, 60)
  state: string;

  @IsString() @Length(2, 2)
  country: string;

  @IsString() @Length(3, 12)
  postal_code: string;

  @IsUrl({ protocols: ['https'], require_protocol: true })
  selfie_image: string;
}