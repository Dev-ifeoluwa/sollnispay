// // import { Module } from '@nestjs/common';
// // import { TransfersController } from './transfers.controller';
// // import { TransfersService } from './transfers.service';

// // @Module({
// //   controllers: [TransfersController],
// //   providers: [TransfersService]
// // })
// // export class TransfersModule {}



// import { Module } from '@nestjs/common';
// import { PrismaService } from 'src/prisma.service';
// import { PinModule } from 'src/pin/pin.module';
// import { TransfersController } from './transfers.controller';
// import { TransfersService } from './transfers.service';

// @Module({
//   imports: [PinModule],
//   controllers: [TransfersController],
//   providers: [TransfersService, PrismaService],
// })
// export class TransfersModule {}






import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PinModule } from 'src/pin/pin.module';
import { PaystackModule } from 'src/paystack/paystack.module';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { TransferSettlementService } from './transfer-settlement.service';
import { TransferReconciliationService } from './transfer-reconciliation.service';

@Module({
  imports: [PinModule, PaystackModule],
  controllers: [TransfersController],
  providers: [TransfersService, TransferSettlementService, TransferReconciliationService, PrismaService],
  exports: [TransferSettlementService], // the Paystack webhook controller uses it
})
export class TransfersModule {}