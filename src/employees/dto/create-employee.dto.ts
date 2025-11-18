import { IsBoolean, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateEmployeeDto {
    @IsString()
    @MinLength(2)
    name: string;

    @IsString()
    @MinLength(2)
    role: string

    @IsNumber()
    @Min(0)
    salary: number;

    @IsBoolean()
    isActive: boolean;

}
