import { Injectable } from '@nestjs/common';
import { RedisCacheService } from '../redis/redisCache.service';
import { MatchResponse } from './match-response';
import { v4 } from 'uuid';

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
      if (map[id] !== null) {
        const matchDetails = map[id];
        delete map[id];
        await this.redisService.set(key, JSON.stringify(map));
        console.log(`${id} has been matched with ${matchDetails.partner}`);
        return resolve({
          status: true,
          id: id,
          partnerId: matchDetails.partner,
          sessionId: matchDetails.sessionId,
          difficulty: difficulty,
          language: language,
        });
      }

      // Finds a matching user
      for (const [otherId, partnerId] of Object.entries(map)) {
        if (otherId !== id && partnerId === null) {
          const sessionId = this.generateSessionId();
          delete map[id];
          map[otherId] = { partner: id, sessionId: sessionId };
          await this.redisService.set(key, JSON.stringify(map));
          console.log(`Successfully matched ${id} with ${otherId}`);

          return resolve({
            status: true,
            id: id,
            partnerId: otherId,
            sessionId: sessionId,
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

  generateSessionId(): string {
    return v4();
  }

  async createMatch(id: string, difficulty: string, language: string) {
    const key = `${difficulty}_${language}`;
    const data = await this.redisService.get(key);
    const map = data !== null ? JSON.parse(data) : {};
    if (!(id in map)) {
      map[id] = null;
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
