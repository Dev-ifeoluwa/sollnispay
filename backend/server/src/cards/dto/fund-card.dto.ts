import { IsNumber, IsString, IsUUID, Length, Max, Min } from 'class-validator';

export class FundCardDto {
  // Placeholder limits until you know Yangaplug's real minimum and maximum
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(500)
  amountUsd: number;

  @IsString()
  @Length(4, 6)
  pin: string;

  // The app generates one per tap, so a double-tap or retry can never fund twice
  @IsUUID()
  requestId: string;
}