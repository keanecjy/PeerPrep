import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';
import { MatchResponse } from './match-response';

@Injectable()
export class MatchService {
  private redisClient;

  constructor() {
    (async () => {
      this.redisClient = createClient();
      this.redisClient.on('error', (err) =>
        console.log('Redis Client Error', err)
      );
      await this.redisClient.connect();
      console.log('Client is connected!');
    })();
  }

  async getMatch(
    id: string,
    difficulty: string,
    language: string
  ): Promise<MatchResponse> {
    const key = `${difficulty}_${language}`;
    for (let retries = 0; retries < 6; retries++) {
      const res = await this.retry(key, id);
      if (res.status) {
        return res;
      }
      setTimeout(() => {}, 5000);
    }

    return {
      status: false,
      id: id,
    };
  }

  retry(key: string, id: string): Promise<MatchResponse> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, async (error, data) => {
        if (error) {
          return reject(error);
        }

        const map = JSON.parse(data);
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
    });
  }

  createMatch(id: string, difficulty: string, language: string): string {
    const key = `${difficulty}_${language}`;

    let map: {} = JSON.parse(this.redisClient.get(key));
    map[id] = '';
    this.redisClient.set(key, map);

    return `Starting match for ${id}`;
  }
}
