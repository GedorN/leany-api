import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { Department } from '../departments/entities/department.entity';

import { EmployeesRepository } from './repositories/employees.repository';
import { DepartmentsRepository } from '../departments/repositories/departments.repository';
import { EmployeeProfilesRepository } from './repositories/employee-profiles.repository';
import { ProjectsRepository } from '../projects/repositories/projects.repository';

describe('EmployeesService', () => {
  let service: EmployeesService;

  let employeesRepo: {
    findAll: jest.Mock;
    findById: jest.Mock;
    findOne: jest.Mock;
    create: jest.Mock;
  };

  let departmentsRepo: {
    findById: jest.Mock;
  };

  beforeEach(async () => {
    employeesRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
    };

    departmentsRepo = {
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesService,
        {
          provide: EmployeesRepository,
          useValue: employeesRepo,
        },
        {
          provide: DepartmentsRepository,
          useValue: departmentsRepo,
        },
        {
          // not used in these tests, but required by the constructor
          provide: EmployeeProfilesRepository,
          useValue: {},
        },
        {
          // not used in these tests, but required by the constructor
          provide: ProjectsRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EmployeesService>(EmployeesService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(employeesRepo).toBeDefined();
    expect(departmentsRepo).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all employees from repository', async () => {
      const employees = [{ id: 1 } as Employee, { id: 2 } as Employee];
      employeesRepo.findAll.mockResolvedValue(employees);

      const result = await service.findAll();

      expect(employeesRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual(employees);
    });
  });

  describe('findOne', () => {
    it('should return the employee when it exists', async () => {
      const employee = { id: 1 } as Employee;
      employeesRepo.findById.mockResolvedValue(employee);

      const result = await service.findOne(1);

      expect(employeesRepo.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(employee);
    });

    it('should throw NotFoundException when employee does not exist', async () => {
      employeesRepo.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });


  describe('create', () => {
  const createDto = {
    name: 'Gedor Neto',
    departmentId: 1,
  } as any;

  it('should create an employee when department exists', async () => {
    const department = { id: createDto.departmentId } as Department;
    const createdEmployee = {
      id: 1,
      ...createDto,
    } as Employee;

    departmentsRepo.findById.mockResolvedValue(department);
    employeesRepo.create.mockReturnValue(createdEmployee);

    const result = await service.create(createDto);

    expect(departmentsRepo.findById).toHaveBeenCalledWith(
      createDto.departmentId,
    );

    expect(employeesRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: createDto.name,
        departmentId: createDto.departmentId,
      }),
    );

    expect(result).toEqual(createdEmployee);
  });

  it('should throw BadRequestException when department does not exist', async () => {
    departmentsRepo.findById.mockResolvedValue(null);

    await expect(service.create(createDto)).rejects.toBeInstanceOf(
      BadRequestException,
    );

      expect(employeesRepo.create).not.toHaveBeenCalled();
    });
  });



});
