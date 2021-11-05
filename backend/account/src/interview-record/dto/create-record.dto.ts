import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDefined,
  IsBoolean,
  IsNumber,
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
  partnerName: string;

  @IsNumber()
  timeTaken: number;

  @IsBoolean()
  @IsDefined()
  isCompleted: boolean;
}
