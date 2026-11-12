import { BadRequestException, Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { AirtimeService } from './airtime.service';
import { PurchaseAirtimeDto } from './dto/purchase-airtime.dto';

@Controller('airtime')
@UseGuards(JwtAuthGuard)
export class AirtimeController {
  constructor(private airtimeService: AirtimeService) {}

  // POST /airtime/purchase  { network, phone, amount, pin, idempotencyKey }
  @Post('purchase')
  @HttpCode(200)
  purchase(@Req() req: Request, @Body() dto: PurchaseAirtimeDto) {
    const userId = (req.user as any)?.userId;
    if (!userId) throw new BadRequestException('No user found');
    return this.airtimeService.purchase(userId, dto);
  }
}