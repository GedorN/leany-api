import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateEmployeeDto {
    @ApiProperty({ example: 'John Doe' })
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

}
