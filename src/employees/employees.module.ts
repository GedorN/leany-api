import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from './entities/employee.entity';
import { EmployeeProfile } from './entities/employee-profile.entity';
import { EmployeesRepository } from './repositories/employees.repository';
import { EmployeeProfilesRepository } from './repositories/employee-profiles.repository';
import { DepartmentsModule } from '../departments/departments.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, EmployeeProfile]),
    DepartmentsModule,
    ProjectsModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesRepository, EmployeeProfilesRepository],
})
export class EmployeesModule {}
