import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { YangaplugModule } from 'src/yangaplug/yangaplug.module';
import { PinModule } from 'src/pin/pin.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { AirtimeController } from './airtime.controller';
import { AirtimeService } from './airtime.service';

@Module({
  imports: [YangaplugModule, PinModule, TransactionsModule],
  controllers: [AirtimeController],
  providers: [AirtimeService, PrismaService],
})
export class AirtimeModule {}