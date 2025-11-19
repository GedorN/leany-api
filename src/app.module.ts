import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesModule } from './employees/employees.module';
import { Employee } from './employees/entities/employee.entity';
import { DepartmentsModule } from './departments/departments.module';
import { Department } from './departments/entities/department.entity';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/entities/project.entity';
import { EmployeeProject } from './projects/entities/employee-project.entity';
import { EmployeeProfile } from './employees/entities/employee-profile.entity';
import { UtilsModule } from './utils/utils.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { configValidationSchema } from './config/config.validation';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Employee, EmployeeProfile, Department, Project, EmployeeProject],
      synchronize: true,
    }),
    EmployeesModule,
    DepartmentsModule,
    ProjectsModule,
    UtilsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
