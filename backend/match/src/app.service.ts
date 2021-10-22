import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): string {
    return 'Match service is up!';
  }
}
