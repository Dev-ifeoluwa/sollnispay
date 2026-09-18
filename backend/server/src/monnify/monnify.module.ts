// import { Module } from '@nestjs/common';
// import { MonnifyService } from './monnify.service';

// @Module({
//   providers: [MonnifyService]
// })
// export class MonnifyModule {}


import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MonnifyService } from './monnify.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [HttpModule],
  providers: [MonnifyService, PrismaService],
  exports: [MonnifyService],
})
export class MonnifyModule {}
