import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreateEmployeeDto {
    @ApiProperty({ example: 'Gedor Neto' })
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty({ example: 'Backend Developer' })
    @IsString()
    @MinLength(2)
    role: string

    @ApiProperty({ example: 12000 })
    @IsNumber()
    @Min(0)
    salary: number;

    @ApiProperty({ example: true })
    @IsBoolean()
    isActive: boolean;

    @ApiPropertyOptional({ example: 1, description: 'Department ID' })
    @IsOptional()
    @IsInt()
    departmentId?: number | null;

}
