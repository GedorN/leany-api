import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
  import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { EmployeeProject } from './entities/employee-project.entity';
import { Employee } from '../employees/entities/employee.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(EmployeeProject)
    private readonly employeeProjectRepo: Repository<EmployeeProject>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  create(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepo.create(dto);
    return this.projectRepo.save(project);
  }

  findAll(): Promise<Project[]> {
    return this.projectRepo.find();
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepo.findOne({ where: { id } });

    if (!project) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    return project;
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    const merged = this.projectRepo.merge(project, dto);
    return this.projectRepo.save(merged);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }
  }

  async addEmployeeToProject(
    projectId: number,
    employeeId: number,
  ): Promise<EmployeeProject> {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId },
    });
    if (!employee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }

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
    });

    return this.employeeProjectRepo.save(ep);
  }

  async removeEmployeeFromProject(
    projectId: number,
    employeeId: number,
  ): Promise<void> {
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

  async listEmployeesInProject(projectId: number): Promise<Employee[]> {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with id ${projectId} not found`);
    }

    const relations = await this.employeeProjectRepo.find({
      where: { projectId },
      relations: ['employee'],
    });

    return relations.map((r) => r.employee);
  }
}
