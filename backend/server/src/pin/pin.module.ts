import { Module } from '@nestjs/common';
import { PinController } from './pin.controller';
import { PinService } from './pin.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PinController],
  providers: [PinService, PrismaService],
  exports: [PinService],
})
export class PinModule {}