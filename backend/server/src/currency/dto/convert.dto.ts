import { IsString, IsNumber } from 'class-validator';

export class ConvertDto {
  @IsString()
  from!: string;     

  @IsString()
  to!: string;       

  @IsNumber()
  amount!: number; 
}
