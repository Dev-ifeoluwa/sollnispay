import { Module } from '@nestjs/common';
import { PaystackController } from './paystack.controller';
import { SabussWebhookController } from './sabuss.controller';
import { PrismaService } from 'src/prisma.service';
import { DataModule } from 'src/data/data.module';
import { TransfersModule } from 'src/transfers/transfers.module';

@Module({
  imports: [DataModule, TransfersModule],
  controllers: [PaystackController, SabussWebhookController],
  providers: [PrismaService],
})
export class WebhooksModule {}