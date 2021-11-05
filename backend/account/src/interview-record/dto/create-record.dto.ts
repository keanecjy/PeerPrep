import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDefined,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreateRecordDto {
  @IsString()
  @IsNotEmpty()
  leetcodeSlug: string;

  @IsString()
  @IsNotEmpty()
  questionName: string;

  @IsUUID()
  @IsOptional()
  partner?: string;

  @IsString()
  timeTaken: string;

  @IsBoolean()
  @IsDefined()
  completed: boolean;
}
