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
    await this.createMatch(id, difficulty, language);
    return await this.findMatch(id, difficulty, language);
  }

  async findMatch(
    id: string,
    difficulty: string,
    language: string
  ): Promise<MatchResponse> {
    return new Promise(async (resolve) => {
      const key = `${difficulty}_${language}`;
      const data = await this.redisService.get(key);
      const map = JSON.parse(data);

      // Terminate if it gets matched with another user
      if (map[id] !== '') {
        console.log(`${id} has been matched with ${map[id]}`);
        return resolve({
          status: true,
          id: id,
          partnerId: map[id],
          sessionId: this.generateSessionId(id, map[id]),
          difficulty: difficulty,
          language: language,
        });
      }

      // Finds a matching user
      for (const [otherId, partnerId] of Object.entries(map)) {
        if (otherId !== id && partnerId === '') {
          map[id] = otherId;
          map[otherId] = id;
          await this.redisService.set(key, JSON.stringify(map));
          console.log(`Successfully matched ${id} with ${otherId}`);

          // Delete match from cache after sending both users into the interview session
          setTimeout(() => {
            delete map[id];
            delete map[otherId];
            this.redisService.set(key, JSON.stringify(map));
          }, 6000);

          return resolve({
            status: true,
            id: id,
            partnerId: otherId,
            sessionId: this.generateSessionId(id, otherId),
            difficulty: difficulty,
            language: language,
          });
        }
      }

      // Not able to find a matching user
      return resolve({
        status: false,
        id: id,
        difficulty: difficulty,
        language: language,
      });
    });
  }

  generateSessionId(firstId: string, secondId: string): string {
    return firstId < secondId
      ? `${firstId}+${secondId}`
      : `${secondId}+${firstId}`;
  }

  async createMatch(id: string, difficulty: string, language: string) {
    const key = `${difficulty}_${language}`;
    const data = await this.redisService.get(key);
    const map = data !== null ? JSON.parse(data) : {};
    if (!(id in map)) {
      map[id] = '';
      await this.redisService.set(key, JSON.stringify(map));
    }
    console.log(`Starting match for ${id}`);
  }

  async deleteMatch(id: string, difficulty: string, language: string) {
    const key = `${difficulty}_${language}`;
    const data = await this.redisService.get(key);
    const map = JSON.parse(data);
    delete map[id];
    await this.redisService.set(key, JSON.stringify(map));
  }
}
