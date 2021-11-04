import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDefined,
  IsBoolean,
} from 'class-validator';

export class CreateRecordDto {
  @IsString()
  @IsNotEmpty()
  leetcodeSlug: string;

  @IsString()
  @IsNotEmpty()
  questionName: string;

  @IsString()
  @IsOptional()
  partner?: string;

  @IsString()
  timeTaken: string;

  @IsBoolean()
  @IsDefined()
  completed: boolean;
}
