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

  @Get('random')
  findAll(
    @Query('diff') difficulty: DifficultyType = DifficultyType.MEDIUM,
    @Query('lang') language: LanguageType = LanguageType.JAVASCRIPT
  ): Observable<LeetcodeQuestionDto> {
    return this.leetcodeService.getRandomWithFallback(difficulty, language);
  }

  @Get(':slug')
  findOne(
    @Param('slug') id: string,
    @Query('lang') language: LanguageType = LanguageType.JAVASCRIPT
  ): Observable<LeetcodeQuestionDto> {
    return this.leetcodeService.getOneWithFallback(id, language);
  }
}
