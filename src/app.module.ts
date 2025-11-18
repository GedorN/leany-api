import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeesModule } from './employees/employees.module';
import { Employee } from './employees/entities/employee.entity';
import { DepartmentsModule } from './departments/departments.module';
import { Department } from './departments/entities/department.entity';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/entities/project.entity';
import { EmployeeProject } from './projects/entities/employee-project.entity';
import { EmployeeProfile } from './employees/entities/employee-profile.entity';



@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'employee_user',
      password: 'employee_pass',
      database: 'employee_manager',
      entities: [Employee, EmployeeProfile, Department, Project, EmployeeProject],
      synchronize: false, // more control over the table.
    }),
    EmployeesModule,
    DepartmentsModule,
    ProjectsModule,
  ],
})
export class AppModule {}
