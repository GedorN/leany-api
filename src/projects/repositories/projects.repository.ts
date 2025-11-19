import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { EmployeeProject } from '../entities/employee-project.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { ProjectModel } from '../domain/project.model';
import { EmployeeModel } from '../../employees/domain/employee.model';

@Injectable()
export class ProjectsRepository {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(EmployeeProject)
    private readonly employeeProjectRepo: Repository<EmployeeProject>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  private toProjectModel(entity: Project): ProjectModel {
    return new ProjectModel(
      entity.id,
      entity.name,
      entity.description ?? null,
      entity.startDate ?? null,
      entity.endDate ?? null,
    );
  }

  private toEmployeeModel(entity: Employee): EmployeeModel {
    return new EmployeeModel(
      entity.id,
      entity.name,
      entity.role,
      entity.salary,
      entity.isActive,
      entity.departmentId ?? null,
    );
  }

  async create(data: {
    name: string;
    description?: string | null;
    startDate?: string | null;
    endDate?: string | null;
  }): Promise<ProjectModel> {
    const entity = this.projectRepo.create({
      name: data.name,
      description: data.description ?? null,
      startDate: data.startDate ?? null,
      endDate: data.endDate ?? null,
    });

    const saved = await this.projectRepo.save(entity);
    return this.toProjectModel(saved);
  }

  async findAll(): Promise<ProjectModel[]> {
    const entities = await this.projectRepo.find();
    return entities.map((e) => this.toProjectModel(e));
  }

  async findById(id: number): Promise<ProjectModel | null> {
    const entity = await this.projectRepo.findOne({ where: { id } });
    return entity ? this.toProjectModel(entity) : null;
  }

  async update(
    id: number,
    data: Partial<{
      name: string;
      description: string | null;
      startDate: string | null;
      endDate: string | null;
    }>,
  ): Promise<ProjectModel | null> {
    const entity = await this.projectRepo.findOne({ where: { id } });
    if (!entity) return null;

    if (data.name !== undefined) entity.name = data.name;
    if (data.description !== undefined) entity.description = data.description;
    if (data.startDate !== undefined) entity.startDate = data.startDate;
    if (data.endDate !== undefined) entity.endDate = data.endDate;

    const saved = await this.projectRepo.save(entity);
    return this.toProjectModel(saved);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.projectRepo.delete(id);
    return result.affected !== 0;
  }

  private async ensureProjectExistsOrThrow(projectId: number): Promise<void> {
    const exists = await this.projectRepo.exist({ where: { id: projectId } });
    if (!exists) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }
  }

  private async ensureEmployeeExistsOrThrow(employeeId: number): Promise<void> {
    const exists = await this.employeeRepo.exist({ where: { id: employeeId } });
    if (!exists) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }
  }

  async addEmployeeToProject(
    projectId: number,
    employeeId: number,
  ): Promise<void> {
    await this.ensureProjectExistsOrThrow(projectId);
    await this.ensureEmployeeExistsOrThrow(employeeId);

    const existing = await this.employeeProjectRepo.findOne({
      where: { projectId, employeeId },
    });

    if (existing) {
      throw new BadRequestException(
        `Employee ${employeeId} is already in project ${projectId}`,
      );
    }

    const ep = this.employeeProjectRepo.create({
      projectId,
      employeeId,
      leftAt: null,
    });

    await this.employeeProjectRepo.save(ep);
  }

  async removeEmployeeFromProject(
    projectId: number,
    employeeId: number,
  ): Promise<void> {
    await this.ensureProjectExistsOrThrow(projectId);

    const result = await this.employeeProjectRepo.delete({
      projectId,
      employeeId,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Employee ${employeeId} is not in project ${projectId}`,
      );
    }
  }

  async listEmployeesInProject(
    projectId: number,
  ): Promise<EmployeeModel[]> {
    await this.ensureProjectExistsOrThrow(projectId);

    const relations = await this.employeeProjectRepo.find({
      where: { projectId },
      relations: ['employee'],
    });

    const employees = relations
      .map((ep) => ep.employee)
      .filter((e) => !!e);

    return employees.map((e) => this.toEmployeeModel(e));
  }

  async listProjectsForEmployee(
    employeeId: number,
  ): Promise<ProjectModel[]> {
    const relations = await this.employeeProjectRepo.find({
      where: { employeeId },
      relations: ['project'],
    });

    const projects = relations
      .map((ep) => ep.project)
      .filter((p) => !!p);

    return projects.map((p) => this.toProjectModel(p));
  }

}
