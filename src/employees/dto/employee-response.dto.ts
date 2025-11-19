import { ApiProperty } from '@nestjs/swagger';
import { EmployeeModel } from '../domain/employee.model';

export class EmployeeResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  salary: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ nullable: true })
  departmentId: number | null;

  static fromModel(model: EmployeeModel): EmployeeResponseDto {
    const dto = new EmployeeResponseDto();
    dto.id = model.id!;
    dto.name = model.name;
    dto.role = model.role;
    dto.salary = model.salary;
    dto.isActive = model.isActive;
    dto.departmentId = model.departmentId;
    return dto;
  }
}
