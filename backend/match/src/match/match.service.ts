import { Injectable } from '@nestjs/common';
import { MatchResponse } from './match-response';
import { RedisCacheService } from '../redis/redisCache.service';

@Injectable()
export class MatchService {
  constructor(private readonly redisService: RedisCacheService) {}

  async getMatch(
    id: string,
    difficulty: string,
    language: string
  ): Promise<MatchResponse> {
    const key = `${difficulty}_${language}`;

    await this.createMatch(key, id);

    for (let retries = 0; retries < 5; retries++) {
      const res = await this.retry(key, id);
      if (res.status) {
        return res;
      }
      await this.sleep(5000);
    }

    return {
      status: false,
      id: id,
    };
  }

  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  async retry(key: string, id: string): Promise<MatchResponse> {
    return new Promise(async (resolve) => {
      const data = await this.redisService.get(key);

      const map = JSON.parse(data);
      console.log(data);

      if (map[id] != '') {
        return resolve({
          status: true,
          id: id,
          partnerId: map[id],
        });
      }

      for (const [otherId, partnerId] of Object.entries(map)) {
        if (otherId != id && partnerId != '') {
          map[id] = otherId;
          map[otherId] = id;
          return resolve({
            status: true,
            id: id,
            partnerId: otherId,
          });
        }
      }

      return resolve({
        status: false,
        id: id,
      });
    });
  }

  async createMatch(key: string, id: string): Promise<string> {
    const data = await this.redisService.get(key);
    const map = JSON.parse(data);
    map[id] = '';
    await this.redisService.set(key, map);

    return `Starting match for ${id}`;
  }
}
