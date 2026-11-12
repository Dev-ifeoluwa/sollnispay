import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { YangaplugModule } from 'src/yangaplug/yangaplug.module';
import { PinModule } from 'src/pin/pin.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { CableController } from './cable.controller';
import { CableService } from './cable.service';

@Module({
  imports: [YangaplugModule, PinModule, TransactionsModule],
  controllers: [CableController],
  providers: [CableService, PrismaService],
})
export class CableModule {}