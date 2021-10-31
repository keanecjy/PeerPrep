import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Delete, Get, Query } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchResponse } from './match-response';
import { first } from 'rxjs';

@ApiTags('Match')
@Controller()
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  /*
  Gets a match for a user if there is a matching user
  */
  @Get('find')
  @ApiOkResponse({ type: MatchResponse })
  async getMatch(
    @Query('id') id: string,
    @Query('difficulty') difficulty: string,
    @Query('language') language: string
  ): Promise<MatchResponse> {
    return this.matchService.getMatch(id, difficulty, language);
  }

  @Delete('delete')
  async deleteMatch(
    @Query('first_id') firstId: string,
    @Query('second_id') secondId: string,
    @Query('difficulty') difficulty: string,
    @Query('language') language: string
  ) {
    return this.matchService.deleteMatch(
      firstId,
      secondId,
      difficulty,
      language
    );
  }
}
