import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@ApiTags('Server')
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  ping(): string {
    return this.appService.ping();
  }
}
