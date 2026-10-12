import { Module } from '@nestjs/common';
import { PaystackController } from './paystack.controller';
import { SabussWebhookController } from './sabuss.controller';
import { PrismaService } from 'src/prisma.service';
import { DataModule } from 'src/data/data.module';

@Module({
  imports: [DataModule],
  controllers: [PaystackController, SabussWebhookController],
  providers: [PrismaService],
})
export class WebhooksModule {}