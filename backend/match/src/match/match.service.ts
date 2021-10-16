import { Injectable } from '@nestjs/common';
import { redis } from 'redis';

@Injectable()
export class MatchService {
  private readonly redisClient = redis.createClient();

  getMatch(id: string, difficulty: string, language: string): string {
    // this.redisClient.setex()
    return id;
  }
}
