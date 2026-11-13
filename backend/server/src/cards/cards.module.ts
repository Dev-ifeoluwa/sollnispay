// import { Module } from '@nestjs/common';
// import { HttpModule } from '@nestjs/axios';
// import { PrismaService } from 'src/prisma.service';
// import { YangaplugService } from 'src/yangaplug/yangaplug.service'; // adjust the path
// import { CardsController } from './cards.controller';
// import { CardsService } from './cards.service';

// @Module({
//   imports: [HttpModule],
//   controllers: [CardsController],
//   providers: [CardsService, YangaplugService, PrismaService],
// })
// export class CardsModule {}




import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/prisma.service';
import { YangaplugService } from 'src/yangaplug/yangaplug.service'; // ADJUST
import { PinService } from 'src/pin/pin.service'; // ADJUST
import { TransactionsService } from 'src/transactions/transactions.service'; // ADJUST
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';

@Module({
  imports: [HttpModule],
  controllers: [CardsController],
  providers: [CardsService, YangaplugService, PinService, TransactionsService, PrismaService],
})
export class CardsModule {}