import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity('employee_profiles')
export class EmployeeProfile {
  @PrimaryColumn({ type: 'int' })
  id: number;

  @Column({ name: 'employee_id', type: 'int', unique: true })
  employeeId: number;

  @OneToOne(() => Employee, (employee) => employee.profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate?: string;

  @Column({ length: 50, nullable: true })
  document?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;
}
