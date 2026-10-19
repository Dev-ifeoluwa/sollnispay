import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CurrencyModule } from './currency/currency.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PinModule } from './pin/pin.module';
import { WebhooksModule } from './webhooks/webhooks.module';
// import { MonnifyModule } from './monnify/monnify.module';
import { PaystackModule } from './paystack/paystack.module';
import { SabussModule } from './sabuss/sabuss.module';
import { DataModule } from './data/data.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TransfersModule } from './transfers/transfers.module';

 
 
 
@Module({
  imports: [
  ConfigModule.forRoot({ isGlobal: true }),
  ScheduleModule.forRoot(),            // <- add
  AuthModule, UsersModule, CurrencyModule, TransactionsModule, PinModule,
  WebhooksModule, PaystackModule,
  SabussModule, DataModule, TransfersModule,
],
  // imports: [ 
  //   ConfigModule.forRoot({
  //     isGlobal: true
  // }), AuthModule, UsersModule, CurrencyModule, TransactionsModule, PinModule, WebhooksModule, MonnifyModule, PaystackModule, SabussModule, DataModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}