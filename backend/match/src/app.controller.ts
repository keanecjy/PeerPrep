import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@ApiTags('Server')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /*
  Checks if the service is up
   */
  @Get()
  ping(): string {
    return this.appService.ping();
  }
}
