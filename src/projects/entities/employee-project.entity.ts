import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Project } from './project.entity';

@Entity('employee_projects')
export class EmployeeProject {
  @PrimaryColumn({ name: 'employee_id', type: 'int' })
  employeeId: number;

  @PrimaryColumn({ name: 'project_id', type: 'int' })
  projectId: number;

  @ManyToOne(() => Employee, (employee) => employee.employeeProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => Project, (project) => project.employeeProjects, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({
    name: 'joined_at',
    type: 'timestamp',
    default: () => 'NOW()',
  })
  joinedAt: Date;

  @Column({
    name: 'left_at',
    type: 'timestamp',
    default: null,
  })
  leftAt: Date | null;
}
