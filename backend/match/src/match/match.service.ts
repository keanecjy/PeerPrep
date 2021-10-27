import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../redis/redisCache.service';
import { MatchResponse } from './match-response';

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
    return await this.findMatch(key, id);
  }

  async findMatch(key: string, id: string): Promise<MatchResponse> {
    return new Promise(async (resolve) => {
      const data = await this.redisService.get(key);
      const map = JSON.parse(data);
      console.log(map);

      // Terminate if it gets matched with another user
      if (map[id] !== '') {
        console.log(`${id} has been matched with ${map[id]}`);
        return resolve({
          status: true,
          id: id,
          partnerId: map[id],
        });
      }

      for (const [otherId, partnerId] of Object.entries(map)) {
        if (otherId !== id && partnerId === '') {
          map[id] = otherId;
          map[otherId] = id;
          await this.redisService.set(key, JSON.stringify(map));
          console.log(`Successfully matched ${id} with ${otherId}`);
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

  async createMatch(key: string, id: string) {
    const data = await this.redisService.get(key);
    const map = data !== null ? JSON.parse(data) : {};
    if (!(id in map)) {
      console.log(`Setting ${id} in map`);
      map[id] = '';
      await this.redisService.set(key, JSON.stringify(map));
    }
    console.log(`Starting match for ${id}`);
  }
}
