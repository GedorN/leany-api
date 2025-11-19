import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'Gedor Neto',
    description: 'Employee full name',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'Backend Developer',
    description: 'Employee role or job title',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  role: string;

  @ApiProperty({
    example: 12000,
    description: 'Gross monthly salary',
  })
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  salary: number;

  @ApiProperty({
    example: true,
    description: 'Whether the employee is currently active',
  })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    example: 1,
    description: 'Department ID the employee belongs to',
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  departmentId: number;
}
