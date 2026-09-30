import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaystackService } from './paystack.service';
import { PrismaService } from 'src/prisma.service';
 
@Module({
  imports: [HttpModule],
  providers: [PaystackService, PrismaService],
  exports: [PaystackService],
})
export class PaystackModule {}
 