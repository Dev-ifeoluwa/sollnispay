// import { Body, Controller, HttpCode, Post, Req, UseGuards, BadRequestException } from '@nestjs/common';
// import type { Request } from 'express';
// import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
// import { PinService } from './pin.service';
// import { ChangePinDto, SetPinDto } from './dto/pin.dto';

// @Controller('pin')
// @UseGuards(JwtAuthGuard)
// export class PinController {
//   constructor(private pinService: PinService) {}

//   private userId(req: Request): number {
//     const id = (req.user as any)?.userId;
//     if (!id) throw new BadRequestException('No user found');
//     return id;
//   }

//   @Post('set')
//   @HttpCode(200)
//   set(@Req() req: Request, @Body() dto: SetPinDto) {
//     return this.pinService.set(this.userId(req), dto.pin);
//   }
  

//   @Post('change')
//   @HttpCode(200)
//   change(@Req() req: Request, @Body() dto: ChangePinDto) {
//     return this.pinService.change(this.userId(req), dto.currentPin, dto.newPin);
//   }
// }





import { Body, Controller, HttpCode, Post, Req, UseGuards, BadRequestException } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { PinService } from './pin.service';
import { PinResetService } from './pin-reset.service';
import { ChangePinDto, ResetPinDto, SetPinDto } from './dto/pin.dto';

@Controller('pin')
@UseGuards(JwtAuthGuard)
export class PinController {
  constructor(
    private pinService: PinService,
    private pinResetService: PinResetService,
  ) {}

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

  // Forgot PIN, step 1: email a 6-digit code to the logged-in user's own email
  @Post('forgot')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  forgot(@Req() req: Request) {
    return this.pinResetService.requestOtp(this.userId(req));
  }

  // Forgot PIN, step 2: code + account password + new PIN
  @Post('reset')
  @HttpCode(200)
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  reset(@Req() req: Request, @Body() dto: ResetPinDto) {
    return this.pinResetService.reset(this.userId(req), dto.otp, dto.password, dto.newPin);
  }
}