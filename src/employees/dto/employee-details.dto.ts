import { ApiProperty } from '@nestjs/swagger';
import { Department } from '../../departments/entities/department.entity';
import { EmployeeProfile } from '../entities/employee-profile.entity';
import { Project } from '../../projects/entities/project.entity';

export class EmployeeDetailsDto {
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

  @ApiProperty({ type: () => Department, nullable: true })
  department: Department | null;

  @ApiProperty({ type: () => EmployeeProfile, nullable: true })
  profile: EmployeeProfile | null;

  @ApiProperty({ type: () => [Project] })
  projects: Project[];
}
