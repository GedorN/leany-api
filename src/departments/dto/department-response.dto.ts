import { ApiProperty } from '@nestjs/swagger';
import { DepartmentModel } from '../domain/department.model';

export class DepartmentResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  static fromModel(model: DepartmentModel): DepartmentResponseDto {
    const dto = new DepartmentResponseDto();
    dto.id = model.id!;
    dto.name = model.name;
    dto.description = model.description;
    return dto;
  }
}
