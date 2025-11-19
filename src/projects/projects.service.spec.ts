import { Test, TestingModule } from '@nestjs/testing';

import { ProjectsService } from './projects.service';
import { ProjectsRepository } from './repositories/projects.repository';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectModel } from './domain/project.model';
import { EmployeeModel } from '../employees/domain/employee.model';

describe('ProjectsService', () => {
  let service: ProjectsService;

  let projectsRepo: {
    create: jest.Mock;
    findAll: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    addEmployeeToProject: jest.Mock;
    removeEmployeeFromProject: jest.Mock;
    listEmployeesInProject: jest.Mock;
  };

  beforeEach(async () => {
    projectsRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addEmployeeToProject: jest.fn(),
      removeEmployeeFromProject: jest.fn(),
      listEmployeesInProject: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: ProjectsRepository,
          useValue: projectsRepo,
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(projectsRepo).toBeDefined();
  });

  describe('create', () => {
    it('should create a project with all fields populated', async () => {
      const dto: CreateProjectDto = {
        name: 'Project A',
        description: 'Some project',
        startDate: '2025-01-01',
        endDate: '2025-06-01',
      };

      const created: ProjectModel = {
        id: 1,
        name: dto.name,
        description: dto.description!,
        startDate: dto.startDate!,
        endDate: dto.endDate!,
      };

      projectsRepo.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(projectsRepo.create).toHaveBeenCalledWith({
        name: dto.name,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
      });
      expect(result).toEqual(created);
    });

    it('should set nullable fields to null when they are undefined in dto', async () => {
      const dto: CreateProjectDto = {
        name: 'Project B',
        // description, startDate and endDate intentionally omitted
      };

      const created: ProjectModel = {
        id: 2,
        name: dto.name,
        description: null,
        startDate: null,
        endDate: null,
      };

      projectsRepo.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(projectsRepo.create).toHaveBeenCalledWith({
        name: dto.name,
        description: null,
        startDate: null,
        endDate: null,
      });
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all projects from repository', async () => {
      const projects: ProjectModel[] = [
        {
          id: 1,
          name: 'Project A',
          description: 'Desc A',
          startDate: '2025-01-01',
          endDate: '2025-06-01',
        },
        {
          id: 2,
          name: 'Project B',
          description: 'Desc B',
          startDate: null,
          endDate: null,
        },
      ];

      projectsRepo.findAll.mockResolvedValue(projects);

      const result = await service.findAll();

      expect(projectsRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual(projects);
    });
  });

  describe('findOne', () => {
    it('should return project when it exists', async () => {
      const project: ProjectModel = {
        id: 1,
        name: 'Project A',
        description: 'Desc A',
        startDate: '2025-01-01',
        endDate: '2025-06-01',
      };

      projectsRepo.findById.mockResolvedValue(project);

      const result = await service.findOne(1);

      expect(projectsRepo.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(project);
    });

    it('should throw Error when project does not exist', async () => {
      projectsRepo.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toBeInstanceOf(Error);
      await expect(service.findOne(999)).rejects.toThrow(
        'Project with id 999 not found',
      );
    });
  });

  describe('update', () => {
    it('should call repository.update and return updated project when it exists', async () => {
      const id = 1;
      const dto: UpdateProjectDto = {
        name: 'Updated Project',
        description: 'Updated desc',
        startDate: '2025-02-01',
        endDate: '2025-07-01',
      };

      const updated: ProjectModel = {
        id,
        name: dto.name!,
        description: dto.description!,
        startDate: dto.startDate!,
        endDate: dto.endDate!,
      };

      projectsRepo.update.mockResolvedValue(updated);

      const result = await service.update(id, dto);

      expect(projectsRepo.update).toHaveBeenCalledWith(id, {
        name: dto.name,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
      });
      expect(result).toEqual(updated);
    });

    it('should pass optional fields as undefined when they are not present in dto', async () => {
      const id = 1;
      const dto: UpdateProjectDto = {
        name: 'Only name updated',
        // description, startDate, endDate intentionally omitted
      };

      const updated: ProjectModel = {
        id,
        name: dto.name!,
        description: 'Keep old description',
        startDate: '2025-01-01',
        endDate: '2025-06-01',
      };

      projectsRepo.update.mockResolvedValue(updated);

      const result = await service.update(id, dto);

      expect(projectsRepo.update).toHaveBeenCalledWith(id, {
        name: dto.name,
        description: undefined,
        startDate: undefined,
        endDate: undefined,
      });
      expect(result).toEqual(updated);
    });

    it('should throw Error when project to update does not exist', async () => {
      const id = 999;
      const dto: UpdateProjectDto = {
        name: 'Does not matter',
        description: 'Does not matter',
      };

      projectsRepo.update.mockResolvedValue(null);

      await expect(service.update(id, dto)).rejects.toBeInstanceOf(Error);
      await expect(service.update(id, dto)).rejects.toThrow(
        `Project with id ${id} not found`,
      );
    });
  });

  describe('remove', () => {
    it('should call repository.delete and not throw when delete returns true', async () => {
      const id = 1;
      projectsRepo.delete.mockResolvedValue(true);

      await expect(service.remove(id)).resolves.toBeUndefined();
      expect(projectsRepo.delete).toHaveBeenCalledWith(id);
    });

    it('should throw Error when delete returns false', async () => {
      const id = 999;
      projectsRepo.delete.mockResolvedValue(false);

      await expect(service.remove(id)).rejects.toBeInstanceOf(Error);
      await expect(service.remove(id)).rejects.toThrow(
        `Project with id ${id} not found`,
      );
    });
  });

  describe('addEmployeeToProject', () => {
    it('should call repository.addEmployeeToProject with projectId and employeeId', async () => {
      const projectId = 1;
      const employeeId = 10;

      projectsRepo.addEmployeeToProject.mockResolvedValue(undefined);

      await service.addEmployeeToProject(projectId, employeeId);

      expect(projectsRepo.addEmployeeToProject).toHaveBeenCalledWith(
        projectId,
        employeeId,
      );
    });
  });

  describe('removeEmployeeFromProject', () => {
    it('should call repository.removeEmployeeFromProject with projectId and employeeId', async () => {
      const projectId = 1;
      const employeeId = 10;

      projectsRepo.removeEmployeeFromProject.mockResolvedValue(undefined);

      await service.removeEmployeeFromProject(projectId, employeeId);

      expect(
        projectsRepo.removeEmployeeFromProject,
      ).toHaveBeenCalledWith(projectId, employeeId);
    });
  });

  describe('listEmployeesInProject', () => {
    it('should call repository.listEmployeesInProject and return employees', async () => {
      const projectId = 1;
      const employees: EmployeeModel[] = [
        { id: 1, name: 'John Doe', departmentId: 1, role: 'dev', salary: 1000 },
        { id: 2, name: 'Jane Doe', departmentId: 2, role: 'qa', salary: 900 },
      ] as any;

      projectsRepo.listEmployeesInProject.mockResolvedValue(employees);

      const result = await service.listEmployeesInProject(projectId);

      expect(projectsRepo.listEmployeesInProject).toHaveBeenCalledWith(
        projectId,
      );
      expect(result).toEqual(employees);
    });
  });
});
