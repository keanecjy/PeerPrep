import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ISeeder {
  abstract seed(): Promise<any>;
}
