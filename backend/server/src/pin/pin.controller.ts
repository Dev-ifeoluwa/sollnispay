import { Body, Controller, HttpCode, Post, Req, UseGuards, BadRequestException } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { PinService } from './pin.service';
import { ChangePinDto, SetPinDto } from './dto/pin.dto';

@Controller('pin')
@UseGuards(JwtAuthGuard)
export class PinController {
  constructor(private pinService: PinService) {}

  private userId(req: Request): number {
    const id = (req.user as any)?.userId;
    if (!id) throw new BadRequestException('No user found');
    return id;
  }

  @Post('set')
  @HttpCode(200)
  set(@Req() req: Request, @Body() dto: SetPinDto) {
    return this.pinService.set(this.userId(req), dto.pin);
  }

  @Post('change')
  @HttpCode(200)
  change(@Req() req: Request, @Body() dto: ChangePinDto) {
    return this.pinService.change(this.userId(req), dto.currentPin, dto.newPin);
  }
}