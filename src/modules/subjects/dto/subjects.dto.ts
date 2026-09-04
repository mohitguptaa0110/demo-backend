import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from "class-validator";

export class CreateCurriculumSubjectDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  subjectName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  credits!: number;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateCurriculumYearDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  year!: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateCurriculumSubjectDto)
  subjects!: CreateCurriculumSubjectDto[];
}

export class CreateCurriculumDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  courseId!: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCurriculumYearDto)
  years!: CreateCurriculumYearDto[];
}

export class SubjectQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsString()
  search: string = '';

  @IsOptional()
  @IsString()
  @IsIn([
    'subjectName',
    'code',
    'year',
    'credits',
  ])
  sortColumn: string = 'name';

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  sortDirection: 'ASC' | 'DESC' = 'ASC';
}

export class UpdateSubjectDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  subjectName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  code?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  credits?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
