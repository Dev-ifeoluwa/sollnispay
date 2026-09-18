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
import { MonnifyModule } from './monnify/monnify.module';



@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true
  }), AuthModule, UsersModule, CurrencyModule, TransactionsModule, PinModule, WebhooksModule, MonnifyModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
