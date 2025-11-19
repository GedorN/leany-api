import { ApiProperty } from '@nestjs/swagger';
import { EmployeeDetailsModel } from '../domain/employee-details.model';
import { EmployeeResponseDto } from './employee-response.dto';
import { EmployeeProfileResponseDto } from './employee-profile-response.dto';
import { DepartmentResponseDto } from '../../departments/dto/department-response.dto';
import { ProjectResponseDto } from '../../projects/dto/project-response.dto';

export class EmployeeDetailsResponseDto {
  @ApiProperty({ type: EmployeeResponseDto })
  employee: EmployeeResponseDto;

  @ApiProperty({ type: EmployeeProfileResponseDto, nullable: true })
  profile: EmployeeProfileResponseDto | null;

  @ApiProperty({ type: DepartmentResponseDto, nullable: true })
  department: DepartmentResponseDto | null;

  @ApiProperty({ type: ProjectResponseDto, isArray: true })
  projects: ProjectResponseDto[];

  static fromModel(model: EmployeeDetailsModel): EmployeeDetailsResponseDto {
    const dto = new EmployeeDetailsResponseDto();

    dto.employee = EmployeeResponseDto.fromModel(model.employee);
    dto.profile = model.profile
      ? EmployeeProfileResponseDto.fromModel(model.profile)
      : null;
    dto.department = model.department
      ? DepartmentResponseDto.fromModel(model.department)
      : null;
    dto.projects = model.projects.map(ProjectResponseDto.fromModel);

    return dto;
  }
}
