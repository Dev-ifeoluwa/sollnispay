import { BadRequestException, Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { TransfersService } from './transfers.service';
import { ResolveWalletDto, SendWalletDto } from './dto/transfer.dto';

@Controller('transfers')
@UseGuards(JwtAuthGuard)
export class TransfersController {
  constructor(private transfers: TransfersService) {}

  private userId(req: Request): number {
    const id = (req.user as any)?.userId;
    if (!id) throw new BadRequestException('No user found');
    return id;
  }

  // POST /transfers/resolve-wallet  { identifier }  ->  { accountName }
  @Post('resolve-wallet')
  @HttpCode(200)
  resolveWallet(@Req() req: Request, @Body() dto: ResolveWalletDto) {
    return this.transfers.resolveWallet(this.userId(req), dto.identifier);
  }

  // POST /transfers/wallet  { identifier, amount, narration?, pin, idempotencyKey }
  //   ->  { id, reference, status, amount, accountName, balance, message }
  @Post('wallet')
  @HttpCode(200)
  sendToWallet(@Req() req: Request, @Body() dto: SendWalletDto) {
    return this.transfers.sendToWallet(this.userId(req), dto);
  }
}