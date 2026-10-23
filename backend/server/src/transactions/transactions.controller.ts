import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {

    constructor(private transactionsService: TransactionsService) {}

   @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.findOne(req.user.userId, id);
  }
}
