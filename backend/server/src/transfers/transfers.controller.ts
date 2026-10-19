// import { BadRequestException, Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
// import type { Request } from 'express';
// import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
// import { TransfersService } from './transfers.service';
// import { ResolveWalletDto, SendWalletDto } from './dto/transfer.dto';

// @Controller('transfers')
// @UseGuards(JwtAuthGuard)
// export class TransfersController {
//   constructor(private transfers: TransfersService) {}

//   private userId(req: Request): number {
//     const id = (req.user as any)?.userId;
//     if (!id) throw new BadRequestException('No user found');
//     return id;
//   }

//   // POST /transfers/resolve-wallet  { identifier }  ->  { accountName }
//   @Post('resolve-wallet')
//   @HttpCode(200)
//   resolveWallet(@Req() req: Request, @Body() dto: ResolveWalletDto) {
//     return this.transfers.resolveWallet(this.userId(req), dto.identifier);
//   }

//   // POST /transfers/wallet  { identifier, amount, narration?, pin, idempotencyKey }
//   //   ->  { id, reference, status, amount, accountName, balance, message }
//   @Post('wallet')
//   @HttpCode(200)
//   sendToWallet(@Req() req: Request, @Body() dto: SendWalletDto) {
//     return this.transfers.sendToWallet(this.userId(req), dto);
//   }
// }








import { BadRequestException, Body, Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { TransfersService } from './transfers.service';
import { ResolveBankDto, ResolveWalletDto, SendBankDto, SendWalletDto } from './dto/transfer.dto';

@Controller('transfers')
@UseGuards(JwtAuthGuard)
export class TransfersController {
  constructor(private transfers: TransfersService) {}

  private userId(req: Request): number {
    const id = (req.user as any)?.userId;
    if (!id) throw new BadRequestException('No user found');
    return id;
  }

  // ---------- Sollnis wallet ----------

  // POST /transfers/resolve-wallet  { identifier }  ->  { accountName }
  @Post('resolve-wallet')
  @HttpCode(200)
  resolveWallet(@Req() req: Request, @Body() dto: ResolveWalletDto) {
    return this.transfers.resolveWallet(this.userId(req), dto.identifier);
  }

  // POST /transfers/wallet  { identifier, amount, narration?, pin, idempotencyKey }
  @Post('wallet')
  @HttpCode(200)
  sendToWallet(@Req() req: Request, @Body() dto: SendWalletDto) {
    return this.transfers.sendToWallet(this.userId(req), dto);
  }

  // ---------- Other banks ----------

  // GET /transfers/banks  ->  { banks: [{ name, code }] }
  @Get('banks')
  banks() {
    return this.transfers.listBanks();
  }

  // POST /transfers/resolve-bank  { accountNumber, bankCode }  ->  { accountName }
  @Post('resolve-bank')
  @HttpCode(200)
  resolveBank(@Req() req: Request, @Body() dto: ResolveBankDto) {
    return this.transfers.resolveBank(this.userId(req), dto);
  }

  // POST /transfers/bank  { bankCode, accountNumber, amount, narration?, pin, idempotencyKey }
  //   ->  { id, reference, status, amount, accountName, balance, message }
  @Post('bank')
  @HttpCode(200)
  sendToBank(@Req() req: Request, @Body() dto: SendBankDto) {
    return this.transfers.sendToBank(this.userId(req), dto);
  }
}