import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateReporteExportDto {
  @IsString()
  @IsIn(['pdf', 'xlsx'])
  format!: 'pdf' | 'xlsx';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  periodoId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  organizacionId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  estado?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  limit?: number = 100;
}
