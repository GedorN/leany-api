import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({
    example: 'New Payment Gateway',
    description: 'Human-readable project name',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'Migration to a new PSP',
    description: 'Optional project description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    example: '2025-01-01',
    description: 'Project start date in ISO format (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2025-06-30',
    description: 'Project end date in ISO format (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string | null;
}
