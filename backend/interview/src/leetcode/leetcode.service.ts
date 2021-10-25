import { catchError, map, Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import {
  DifficultyType,
  LeetcodeGraphQLRandomResponseDto,
  LeetcodeGraphQLResponseDto,
} from './dto/leetcode-question.dto';

@Injectable()
export class LeetcodeService {
  constructor(private httpService: HttpService) {}

  findRandom(
    difficulty: DifficultyType
  ): Observable<LeetcodeGraphQLRandomResponseDto> {
    return this.httpService
      .post('https://leetcode.com/graphql', {
        query: `query randomQuestion($categorySlug: String, $filters: QuestionListFilterInput) {
        randomQuestion(categorySlug: $categorySlug, filters: $filters) {
            titleSlug
            questionId
            title
            codeDefinition
            content
            difficulty
            topicTags {
                name
            }
            codeSnippets {
                lang
                langSlug
                code
            }
            hints
            exampleTestcases
            sampleTestCase
            metaData
        }
    }`,
        variables: {
          categorySlug: '',
          filters: {
            difficulty: difficulty,
          },
        },
      })
      .pipe(
        map((res) => res.data as LeetcodeGraphQLRandomResponseDto),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        })
      );
  }

  findOne(slug: string): Observable<LeetcodeGraphQLResponseDto> {
    return this.httpService
      .post('https://leetcode.com/graphql', {
        query: `query questionData($titleSlug: String!) {
        question(titleSlug: $titleSlug) {
            titleSlug
            questionId
            title
            codeDefinition
            content
            difficulty
            topicTags {
                name
            }
            codeSnippets {
                lang
                langSlug
                code
            }
            hints
            exampleTestcases
            sampleTestCase
            metaData
        }
    }`,
        variables: {
          titleSlug: slug,
        },
      })
      .pipe(
        map((res) => res.data as LeetcodeGraphQLResponseDto),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        })
      );
  }
}
