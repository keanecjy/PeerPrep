import { QUESTIONS } from './fallbacks/questions';
import {
  catchError,
  delay,
  filter,
  map,
  Observable,
  of,
  repeatWhen,
  take,
  timeout,
  TimeoutError,
} from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import {
  DifficultyType,
  LanguageType,
  LeetcodeGraphQLRandomResponseDto,
  LeetcodeGraphQLResponseDto,
  LeetcodeQuestionDto,
  LeetcodeResponseDto,
} from './dto/leetcode-question.dto';

@Injectable()
export class LeetcodeService {
  constructor(private httpService: HttpService) {}

  getRandomWithFallback(
    difficulty: DifficultyType,
    lang: LanguageType
  ): Observable<LeetcodeQuestionDto> {
    return this.findOneRandom(difficulty, lang).pipe(
      timeout(3000),
      repeatWhen((obs) => obs.pipe(delay(250))),
      filter((data) => data.content !== null && data.code.length > 0),
      take(1),
      catchError((error) => {
        if (error instanceof TimeoutError) {
          console.log('Timeout');
        }
        const random: number = Math.floor(Math.random() * 3);
        const filteredQuestions = QUESTIONS.filter(
          (x) => x.difficulty.toLowerCase() === difficulty
        );
        const question = filteredQuestions[random] as any;
        const code = question.code?.filter(
          (snippets) => snippets.langSlug === lang
        )[0];
        question.code = code.code;
        return of(question);
      })
    );
  }

  findOneRandom(
    difficulty: DifficultyType,
    lang: LanguageType
  ): Observable<LeetcodeQuestionDto> {
    return this.httpService
      .post('https://leetcode.com/graphql', {
        operationName: 'randomQuestion',
        query: `query randomQuestion($categorySlug: String, $filters: QuestionListFilterInput) {
        randomQuestion(categorySlug: $categorySlug, filters: $filters) {
            titleSlug
            questionId
            title
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
            metaData
        }
    }`,
        variables: {
          categorySlug: '',
          filters: {
            difficulty: difficulty.toUpperCase(),
          },
        },
      })
      .pipe(
        map((res) => {
          const data = res.data as LeetcodeGraphQLRandomResponseDto;
          const question = data.data.randomQuestion;
          return this.parseLeetcodeQuestion(question, lang);
        }),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        })
      );
  }

  getOneWithFallback(
    slug: string,
    lang: LanguageType
  ): Observable<LeetcodeQuestionDto> {
    const qns = QUESTIONS.filter((x) => x.titleSlug === slug);
    if (qns.length > 0) {
      const question = qns[0] as any;
      const code = question.code?.filter(
        (snippets) => snippets.langSlug === lang
      )[0];
      question.code = code.code;
      return of(question);
    }

    return this.findOne(slug, lang);
  }

  findOne(slug: string, lang: LanguageType): Observable<LeetcodeQuestionDto> {
    return this.httpService
      .post('https://leetcode.com/graphql', {
        operationName: 'questionData',
        query: `query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
              titleSlug
              questionId
              title
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
              metaData
        }
    }`,
        variables: {
          titleSlug: slug,
        },
      })
      .pipe(
        map((res) => {
          const data = res.data as LeetcodeGraphQLResponseDto;
          const question = data.data.question;
          return this.parseLeetcodeQuestion(question, lang);
        }),
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        })
      );
  }

  private parseLeetcodeQuestion = (
    question: LeetcodeResponseDto,
    lang: LanguageType
  ): LeetcodeQuestionDto => {
    if (question.content === null) {
      throw new NotFoundException('Question not found');
    }

    const code =
      question.codeSnippets?.filter((snippets) => snippets.langSlug === lang) ??
      [];
    return {
      titleSlug: question.titleSlug,
      title: question.title,
      questionId: question.questionId,
      content: question.content,
      difficulty: question.difficulty,
      topics: question.topicTags?.map((topic) => topic.name) ?? [],
      code: code.length > 0 ? code[0].code : '',
      hints: question.hints,
      metaData: question.metaData,
    };
  };
}
