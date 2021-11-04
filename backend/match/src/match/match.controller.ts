import { Controller, Delete, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MatchResponse } from './match-response';
import { MatchService } from './match.service';

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

  /*
  Deletes a user from the match database
  */
  @Delete('delete')
  async deleteMatch(
    @Query('id') id: string,
    @Query('difficulty') difficulty: string,
    @Query('language') language: string
  ) {
    return this.matchService.deleteMatch(id, difficulty, language);
  }
}
