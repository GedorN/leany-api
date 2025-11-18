import {
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeProfileDto {
  @ApiPropertyOptional({ example: '1990-05-20' })
  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @ApiPropertyOptional({ example: '123.456.789-00' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  document?: string;

  @ApiPropertyOptional({ example: 'Street X, 123, District Y, City Z' })
  @IsOptional()
  @IsString()
  address?: string;
}
