import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDefined,
  IsBoolean,
} from 'class-validator';

export class CreateInterviewDto {
  @IsString()
  @IsNotEmpty()
  leetcodeSlug: string;

  @IsString()
  @IsOptional()
  partner?: string;

  @IsString()
  timeTaken: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsBoolean()
  @IsDefined()
  completed: boolean;
}
