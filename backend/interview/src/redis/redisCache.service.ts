import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async getQuestion(sessionId: string): Promise<any> {
    return await this.cache.get(sessionId + '_qn');
  }

  async setQuestion(sessionId: string, qn: any): Promise<any> {
    return await this.cache.set(sessionId + '_qn', qn);
  }

  async getCode(sessionId: string): Promise<string> {
    return await this.cache.get(sessionId + '_code');
  }

  async setCode(sessionId: string, code: string): Promise<string> {
    return await this.cache.set(sessionId + '_code', code);
  }

  async getTime(sessionId: string): Promise<string> {
    return await this.cache.get(sessionId + '_time');
  }

  async setTime(sessionId: string, time: string): Promise<string> {
    return await this.cache.set(sessionId + '_time', time);
  }

  async deleteCache(sessionId: string) {
    const sessionKeys = [
      sessionId + '_qn',
      sessionId + '_code',
      sessionId + '_time',
    ];
    return await Promise.all(
      sessionKeys.map((key) =>
        this.cache.del(key, (err) => {
          console.log('Failed to delete session cache for' + sessionId);
          console.log(err);
        })
      )
    );
  }
}
