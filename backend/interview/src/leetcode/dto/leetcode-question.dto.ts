import { IsArray, IsString } from 'class-validator';

export enum DifficultyType {
  EASY,
  MEDIUM,
  HARD,
}

export class LeetcodeQuestionDto {
  @IsString()
  titleSlug: string;
  @IsString()
  questionId: string;
  @IsString()
  title: string;
  @IsString()
  codeDefinition: string;
  @IsString()
  content: string;
  @IsString()
  difficulty: DifficultyType;
  @IsArray()
  topicTags: { name: string }[];
  @IsArray()
  codeSnippets: {
    lang: string;
    langSlug: string;
    code: string;
  }[];
  @IsArray()
  hints: string[];
  @IsString()
  exampleTestcases: string;
  @IsString()
  sampleTestCase: string;
  @IsString()
  metaData: string;
}

export class LeetcodeGraphQLResponseDto {
  data: {
    question: LeetcodeQuestionDto;
  };
}

export class LeetcodeGraphQLRandomResponseDto {
  data: {
    randomQuestion: LeetcodeQuestionDto;
  };
}
