// import { Module } from '@nestjs/common';
// import { MonnifyController } from './monnify.controller';

// @Module({
//   controllers: [MonnifyController]
// })
// export class WebhooksModule {}





import { Module } from '@nestjs/common';
import { MonnifyController } from './monnify.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [MonnifyController],
  providers: [PrismaService],
})
export class WebhooksModule {}