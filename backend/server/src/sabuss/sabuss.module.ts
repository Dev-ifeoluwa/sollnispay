import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SabussService } from './sabuss.service';

@Module({
  imports: [HttpModule],
  providers: [SabussService],
  exports: [SabussService],
})
export class SabussModule {}