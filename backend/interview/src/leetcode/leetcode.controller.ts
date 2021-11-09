import { ApiTags } from '@nestjs/swagger';
import {
  DifficultyType,
  LanguageType,
  LeetcodeQuestionDto,
} from './dto/leetcode-question.dto';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { LeetcodeService } from './leetcode.service';
import { Observable } from 'rxjs';

@ApiTags('Leetcode')
@Controller('leetcode')
export class LeetcodeController {
  constructor(private readonly leetcodeService: LeetcodeService) {}

  /**
   * Get a random LeetCode question based on difficulty and language
   *
   * Times out after 3 seconds and randomly select one fallback LeetCode question
   * from local store
   */
  @Get('random')
  findAll(
    @Query('diff') difficulty: DifficultyType = DifficultyType.MEDIUM,
    @Query('lang') language: LanguageType = LanguageType.JAVASCRIPT
  ): Observable<LeetcodeQuestionDto> {
    return this.leetcodeService.getRandomWithFallback(difficulty, language);
  }

  /**
   * Get a LeetCode question based on provided slug and code based on provided language
   *
   * Selects from local store if it originates from there.
   */
  @Get(':slug')
  findOne(
    @Param('slug') id: string,
    @Query('lang') language: LanguageType = LanguageType.JAVASCRIPT
  ): Observable<LeetcodeQuestionDto> {
    return this.leetcodeService.getOneWithFallback(id, language);
  }
}
