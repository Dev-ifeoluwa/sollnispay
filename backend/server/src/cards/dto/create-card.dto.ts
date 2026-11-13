import { IsIn } from 'class-validator';

export class CreateCardDto {
  @IsIn(['mastercard', 'visa'])
  issuer: 'mastercard' | 'visa';
}