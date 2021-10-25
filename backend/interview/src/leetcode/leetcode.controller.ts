import {
  DifficultyType,
  LeetcodeQuestionDto,
} from './dto/leetcode-question.dto';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { LeetcodeService } from './leetcode.service';
import { map, Observable } from 'rxjs';

@Controller('leetcode')
export class LeetcodeController {
  constructor(private readonly leetcodeService: LeetcodeService) {}

  @Get('random')
  findAll(
    @Query('difficulty') difficulty: DifficultyType
  ): Observable<LeetcodeQuestionDto> {
    return this.leetcodeService
      .findRandom(difficulty)
      .pipe(map((data) => data.data.randomQuestion));
  }

  @Get(':slug')
  findOne(@Param('slug') id: string): Observable<LeetcodeQuestionDto> {
    return this.leetcodeService
      .findOne(id)
      .pipe(map((data) => data.data.question));
  }
}
