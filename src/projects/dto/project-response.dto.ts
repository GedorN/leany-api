import { ApiProperty } from '@nestjs/swagger';
import { ProjectModel } from '../domain/project.model';

export class ProjectResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ nullable: true, example: '2025-01-01' })
  startDate: string | null;

  @ApiProperty({ nullable: true, example: '2025-06-30' })
  endDate: string | null;

  static fromModel(model: ProjectModel): ProjectResponseDto {
    const dto = new ProjectResponseDto();
    dto.id = model.id!;
    dto.name = model.name;
    dto.description = model.description;
    dto.startDate = model.startDate;
    dto.endDate = model.endDate;
    return dto;
  }
}
