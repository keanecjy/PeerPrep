import { IsArray, IsString } from 'class-validator';

export enum DifficultyType {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

export enum LanguageType {
  JAVA = 'java',
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
}

export class LeetcodeQuestionDto {
  @IsString()
  titleSlug: string;

  @IsString()
  questionId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  difficulty: DifficultyType;

  @IsArray()
  topics: string[];

  @IsString()
  code: string;

  @IsArray()
  hints: string[];

  @IsString()
  exampleTestcases: string;

  @IsString()
  sampleTestCase: string;

  @IsString()
  metaData: string;
}

export class LeetcodeResponseDto {
  @IsString()
  titleSlug: string;

  @IsString()
  questionId: string;

  @IsString()
  title: string;

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
    question: LeetcodeResponseDto;
  };
}

export class LeetcodeGraphQLRandomResponseDto {
  data: {
    randomQuestion: LeetcodeResponseDto;
  };
}
