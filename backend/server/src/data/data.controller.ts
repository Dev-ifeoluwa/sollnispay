import { BadRequestException, Body, Controller, Get, HttpCode, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { DataService } from './data.service';
import { PurchaseDataDto } from './dto/purchase-data.dto';

@Controller('data')
@UseGuards(JwtAuthGuard)
export class DataController {
  constructor(private dataService: DataService) {}

  // GET /data/plans?network=MTN
  @Get('plans')
  plans(@Query('network') network?: string) {
    return this.dataService.listPlans(network);
  }

  // POST /data/purchase  { planId, phone, pin, idempotencyKey }
  @Post('purchase')
  @HttpCode(200)
  purchase(@Req() req: Request, @Body() dto: PurchaseDataDto) {
    const userId = (req.user as any)?.userId;
    if (!userId) throw new BadRequestException('No user found');
    return this.dataService.purchase(userId, dto);
  }
}