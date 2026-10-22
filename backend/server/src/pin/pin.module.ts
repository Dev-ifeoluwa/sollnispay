import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { PinController } from './pin.controller';
import { PinService } from './pin.service';
import { PinResetService } from './pin-reset.service';
import { PrismaService } from 'src/prisma.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [MailModule, ThrottlerModule.forRoot([{ ttl: 60_000, limit: 10 }])],
  controllers: [PinController],
  providers: [PinService, PinResetService, PrismaService],
  exports: [PinService],
})
export class PinModule {}