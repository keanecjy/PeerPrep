import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { LeetcodeModule } from './leetcode/leetcode.module';
import { RedisCacheModule } from './redis/redisCache.module';

@Module({
  imports: [LeetcodeModule, RedisCacheModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
