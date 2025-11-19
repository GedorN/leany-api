import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { EmployeeResponseDto } from '../employees/dto/employee-response.dto';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: jest.Mocked<ProjectsService>;

  beforeEach(async () => {
    const serviceMock: jest.Mocked<ProjectsService> = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      addEmployeeToProject: jest.fn(),
      removeEmployeeFromProject: jest.fn(),
      listEmployeesInProject: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get(ProjectsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return ProjectResponseDto', async () => {
      const dto: CreateProjectDto = {
        name: 'Project A',
        description: 'Some project',
        startDate: '2025-01-01',
        endDate: '2025-06-01',
      };

      const model = {
        id: 1,
        name: dto.name,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
      } as any;

      service.create.mockResolvedValue(model);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(ProjectResponseDto.fromModel(model));
    });
  });

  describe('findAll', () => {
    it('should return a list of ProjectResponseDto', async () => {
      const models = [
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
      ] as any[];

      service.findAll.mockResolvedValue(models);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(models.map(ProjectResponseDto.fromModel));
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id and return ProjectResponseDto', async () => {
      const id = 1;
      const model = {
        id,
        name: 'Project A',
        description: 'Desc A',
        startDate: '2025-01-01',
        endDate: '2025-06-01',
      } as any;

      service.findOne.mockResolvedValue(model);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(ProjectResponseDto.fromModel(model));
    });
  });

  describe('update', () => {
    it('should call service.update and return ProjectResponseDto', async () => {
      const id = 1;
      const dto: UpdateProjectDto = {
        name: 'Updated Project',
        description: 'Updated desc',
        startDate: '2025-02-01',
        endDate: '2025-07-01',
      };

      const model = {
        id,
        name: dto.name,
        description: dto.description,
        startDate: dto.startDate,
        endDate: dto.endDate,
      } as any;

      service.update.mockResolvedValue(model);

      const result = await controller.update(id, dto);

      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(ProjectResponseDto.fromModel(model));
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      const id = 1;
      service.remove.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });

  describe('addEmployee', () => {
    it('should call service.addEmployeeToProject with projectId and employeeId', async () => {
      const projectId = 1;
      const employeeId = 10;

      service.addEmployeeToProject.mockResolvedValue(undefined);

      await controller.addEmployee(projectId, employeeId);

      expect(service.addEmployeeToProject).toHaveBeenCalledWith(
        projectId,
        employeeId,
      );
    });
  });

  describe('removeEmployee', () => {
    it('should call service.removeEmployeeFromProject with projectId and employeeId', async () => {
      const projectId = 1;
      const employeeId = 10;

      service.removeEmployeeFromProject.mockResolvedValue(undefined);

      await controller.removeEmployee(projectId, employeeId);

      expect(service.removeEmployeeFromProject).toHaveBeenCalledWith(
        projectId,
        employeeId,
      );
    });
  });

  describe('listEmployees', () => {
    it('should call service.listEmployeesInProject and return EmployeeResponseDto list', async () => {
      const projectId = 1;

      const employees = [
        {
          id: 1,
          name: 'Gedor Neto',
          role: 'dev',
          salary: 1000,
          departmentId: 1,
        },
        {
          id: 2,
          name: 'Vitoria Alves',
          role: 'qa',
          salary: 900,
          departmentId: 2,
        },
      ] as any[];

      service.listEmployeesInProject.mockResolvedValue(employees);

      const result = await controller.listEmployees(projectId);

      expect(service.listEmployeesInProject).toHaveBeenCalledWith(projectId);
      expect(result).toEqual(employees.map(EmployeeResponseDto.fromModel));
    });
  });
});
