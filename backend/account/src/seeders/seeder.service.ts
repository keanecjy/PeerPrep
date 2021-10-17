import { AppConfigService } from 'src/config/app.config';
import { ISeeder } from './seeder.interface';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly seeders: ISeeder[]
  ) {}

  onApplicationBootstrap() {
    return this.run();
  }

  async run(): Promise<any> {
    if (this.appConfigService.isDev) {
      console.log('Starting seed...');
      return this.seed();
    }
  }

  async seed(): Promise<any> {
    for (const seeder of this.seeders) {
      console.log(`Starting ${seeder.constructor.name}...`);
      await seeder.seed();
      console.log(`${seeder.constructor.name} completed`);
    }
  }
}
