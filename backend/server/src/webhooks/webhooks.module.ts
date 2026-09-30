import { Module } from '@nestjs/common';
import { MonnifyController } from './monnify.controller';
import { PaystackController } from './paystack.controller';
import { PrismaService } from 'src/prisma.service';
 
@Module({
  // MonnifyController stays until Paystack is verified end to end, then remove it.
  controllers: [MonnifyController, PaystackController],
  providers: [PrismaService],
})
export class WebhooksModule {}
 