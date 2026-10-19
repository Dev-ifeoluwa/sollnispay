// import { Module } from '@nestjs/common';
// import { HttpModule } from '@nestjs/axios';
// import { PaystackService } from './paystack.service';
// import { PrismaService } from 'src/prisma.service';
 
// @Module({
//   imports: [HttpModule],
//   providers: [PaystackService, PrismaService],
//   exports: [PaystackService],
// })
// export class PaystackModule {}
 




import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaystackService } from './paystack.service';
import { PaystackTransferService } from './paystack-transfer.service';
import { PrismaService } from 'src/prisma.service';
 
@Module({
  imports: [HttpModule],
  providers: [PaystackService, PaystackTransferService, PrismaService],
  exports: [PaystackService, PaystackTransferService],
})
export class PaystackModule {}