import { Module } from '@nestjs/common';
import { LeetcodeService } from './leetcode.service';
import { LeetcodeController } from './leetcode.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [LeetcodeController],
  providers: [LeetcodeService],
  exports: [LeetcodeService],
})
export class LeetcodeModule {}
