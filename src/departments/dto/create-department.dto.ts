import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({
    example: 'Engineering',
    description: 'Human-readable department name',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'Responsible for product development',
    description: 'Optional department description',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
