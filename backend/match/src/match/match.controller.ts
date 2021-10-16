import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { MatchService } from './match.service';

@ApiTags('Server')
@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get('id')
  getMatch(
    @Param('id') id: string,
    @Query('difficulty') difficulty: string,
    @Query('language') language: string
  ): string {
    return this.matchService.getMatch(id, difficulty, language);
  }
}
