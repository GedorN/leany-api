import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { EmployeeProject } from './entities/employee-project.entity';
import { Employee } from '../employees/entities/employee.entity';
import { ProjectsRepository } from './repositories/projects.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Project, EmployeeProject, Employee])],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectsRepository],
  exports: [ProjectsRepository]
})
export class ProjectsModule {}
