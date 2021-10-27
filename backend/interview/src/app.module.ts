import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { LeetcodeModule } from './leetcode/leetcode.module';

@Module({
  imports: [LeetcodeModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
