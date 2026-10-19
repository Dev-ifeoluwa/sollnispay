// import { Module } from '@nestjs/common';
// import { TransfersController } from './transfers.controller';
// import { TransfersService } from './transfers.service';

// @Module({
//   controllers: [TransfersController],
//   providers: [TransfersService]
// })
// export class TransfersModule {}



import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PinModule } from 'src/pin/pin.module';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';

@Module({
  imports: [PinModule],
  controllers: [TransfersController],
  providers: [TransfersService, PrismaService],
})
export class TransfersModule {}