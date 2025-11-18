import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from './entities/employee.entity';
import { EmployeeProfile } from './entities/employee-profile.entity';
import { Department } from '../departments/entities/department.entity';
import { EmployeeProject } from '../projects/entities/employee-project.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      EmployeeProfile,
      Department,
      EmployeeProject,
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
