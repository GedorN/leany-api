// src/projects/projects.service.ts
import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsRepository } from './repositories/projects.repository';
import { ProjectModel } from './domain/project.model';
import { EmployeeModel } from '../employees/domain/employee.model';

@Injectable()
export class ProjectsService {
  constructor(private readonly projectsRepo: ProjectsRepository) {}

  create(dto: CreateProjectDto): Promise<ProjectModel> {
    return this.projectsRepo.create({
      name: dto.name,
      description: dto.description ?? null,
      startDate: dto.startDate ?? null,
      endDate: dto.endDate ?? null,
    });
  }

  findAll(): Promise<ProjectModel[]> {
    return this.projectsRepo.findAll();
  }

  findOne(id: number): Promise<ProjectModel> {
    return this.projectsRepo.findById(id).then((project) => {
      if (!project) {
        throw new Error(`Project with id ${id} not found`);
      }
      return project;
    });
  }

  async update(
    id: number,
    dto: UpdateProjectDto,
  ): Promise<ProjectModel> {
    const updated = await this.projectsRepo.update(id, {
      name: dto.name,
      description:
        dto.description !== undefined ? dto.description : undefined,
      startDate:
        dto.startDate !== undefined ? dto.startDate : undefined,
      endDate: dto.endDate !== undefined ? dto.endDate : undefined,
    });

    if (!updated) {
      throw new Error(`Project with id ${id} not found`);
    }

    return updated;
  }

  async remove(id: number): Promise<void> {
    const ok = await this.projectsRepo.delete(id);
    if (!ok) {
      throw new Error(`Project with id ${id} not found`);
    }
  }

  addEmployeeToProject(
    projectId: number,
    employeeId: number,
  ): Promise<void> {
    return this.projectsRepo.addEmployeeToProject(projectId, employeeId);
  }

  removeEmployeeFromProject(
    projectId: number,
    employeeId: number,
  ): Promise<void> {
    return this.projectsRepo.removeEmployeeFromProject(
      projectId,
      employeeId,
    );
  }

  listEmployeesInProject(projectId: number): Promise<EmployeeModel[]> {
    return this.projectsRepo.listEmployeesInProject(projectId);
  }
}
