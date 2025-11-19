import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeProfileDto {
  @ApiPropertyOptional({
    example: '1990-05-20',
    description: 'Employee birth date in ISO format (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({
    example: '123.456.789-00',
    description: 'Employee document identifier (e.g. national ID)',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  document?: string;

  @ApiPropertyOptional({
    example: 'Street X, 123, District Y, City Z',
    description: 'Full employee address',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address?: string;
}
