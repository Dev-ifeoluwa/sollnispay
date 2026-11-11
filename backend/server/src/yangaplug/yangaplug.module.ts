import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { YangaplugService } from './yangaplug.service';
// import { YangaplusService } from './yangaplug.service';

@Module({
  imports: [HttpModule],
  providers: [YangaplugService],
  exports: [YangaplugService],
})
export class YangaplugModule {}
