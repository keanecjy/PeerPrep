import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDefined,
  IsBoolean,
  IsUUID,
  IsNumber,
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

  @IsNumber()
  timeTaken: number;

  @IsBoolean()
  @IsDefined()
  completed: boolean;
}
