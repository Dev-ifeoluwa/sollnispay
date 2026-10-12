import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SabussModule } from 'src/sabuss/sabuss.module';
import { PinModule } from 'src/pin/pin.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { SettlementService } from './settlement.service';
import { PlanSyncService } from './plan-sync.service';
import { ReconciliationService } from './reconciliation.service';

@Module({
  imports: [SabussModule, PinModule, TransactionsModule],
  controllers: [DataController],
  providers: [DataService, SettlementService, PlanSyncService, ReconciliationService, PrismaService],
  exports: [SettlementService],
})
export class DataModule {}