import { BadRequestException, Body, Controller, Get, HttpCode, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { CableService } from './cable.service';
import { PurchaseCableDto } from './dto/purchase-cable.dto';
import { VerifyCableDto } from './dto/verify-cable.dto';

@Controller('cable')
@UseGuards(JwtAuthGuard)
export class CableController {
  constructor(private cableService: CableService) {}

  // GET /cable/providers
  @Get('providers')
  providers() {
    return this.cableService.providers();
  }

  // GET /cable/plans?provider=dstv_cable_tv
  @Get('plans')
  plans(@Query('provider') provider?: string) {
    if (!provider || !/^[a-z0-9_]{3,40}$/.test(provider)) throw new BadRequestException('Choose a cable TV provider');
    return this.cableService.plans(provider);
  }

  // POST /cable/verify  { provider, smartcard }
  @Post('verify')
  @HttpCode(200)
  verify(@Body() dto: VerifyCableDto) {
    return this.cableService.verify(dto);
  }

  // POST /cable/purchase  { provider, planId, smartcard, phone?, pin, idempotencyKey }
  @Post('purchase')
  @HttpCode(200)
  purchase(@Req() req: Request, @Body() dto: PurchaseCableDto) {
    const userId = (req.user as any)?.userId;
    if (!userId) throw new BadRequestException('No user found');
    return this.cableService.purchase(userId, dto);
  }
}