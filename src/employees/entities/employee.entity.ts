import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { EmployeeProject } from 'src/projects/entities/employee-project.entity';
import { EmployeeProfile } from './employee-profile.entity';

@Entity('employees') 
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  role: string;

  @Column({
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => Number(value), 
    },
  })
  salary: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'department_id', type: 'int', nullable: true })
  departmentId?: number | null;

  @ManyToOne(() => Department, (department) => department.employees, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  
  @JoinColumn({ name: 'department_id' })
  department?: Department | null;

  @OneToMany(() => EmployeeProject, (ep) => ep.employee)
  employeeProjects: EmployeeProject[];

  @OneToOne(() => EmployeeProfile, (profile) => profile.employee)
  profile?: EmployeeProfile;
}