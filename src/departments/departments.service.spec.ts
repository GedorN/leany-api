import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { DepartmentsService } from './departments.service';
import { DepartmentsRepository } from './repositories/departments.repository';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentModel } from './domain/department.model';

describe('DepartmentsService', () => {
  let service: DepartmentsService;

  let departmentsRepo: {
    create: jest.Mock;
    findAll: jest.Mock;
    findById: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    departmentsRepo = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: DepartmentsRepository,
          useValue: departmentsRepo,
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(departmentsRepo).toBeDefined();
  });

  describe('create', () => {
    it('should call repository.create with name and description and return created department', async () => {
      const dto: CreateDepartmentDto = {
        name: 'IT',
        description: 'Tech department',
      };

      const created: DepartmentModel = {
        id: 1,
        name: 'IT',
        description: 'Tech department',
      };

      departmentsRepo.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(departmentsRepo.create).toHaveBeenCalledWith({
        name: dto.name,
        description: dto.description,
      });
      expect(result).toEqual(created);
    });

    it('should set description to null when dto.description is undefined', async () => {
      const dto: CreateDepartmentDto = {
        name: 'HR',
      };

      const created: DepartmentModel = {
        id: 2,
        name: 'HR',
        description: null,
      };

      departmentsRepo.create.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(departmentsRepo.create).toHaveBeenCalledWith({
        name: dto.name,
        description: null,
      });
      expect(result).toEqual(created);
    });
  });

  describe('findAll', () => {
    it('should return all departments from repository', async () => {
      const departments: DepartmentModel[] = [
        { id: 1, name: 'IT', description: 'Tech' },
        { id: 2, name: 'HR', description: 'People' },
      ];

      departmentsRepo.findAll.mockResolvedValue(departments);

      const result = await service.findAll();

      expect(departmentsRepo.findAll).toHaveBeenCalled();
      expect(result).toEqual(departments);
    });
  });

  describe('findOne', () => {
    it('should return department when it exists', async () => {
      const dep: DepartmentModel = {
        id: 1,
        name: 'IT',
        description: 'Tech',
      };

      departmentsRepo.findById.mockResolvedValue(dep);

      const result = await service.findOne(1);

      expect(departmentsRepo.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(dep);
    });

    it('should throw NotFoundException when department does not exist', async () => {
      departmentsRepo.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      await expect(service.findOne(999)).rejects.toThrow(
        'Department with id 999 not found',
      );
    });
  });

  describe('update', () => {
    it('should call repository.update and return updated department when it exists', async () => {
      const id = 1;
      const dto: UpdateDepartmentDto = {
        name: 'New IT',
        description: 'Updated description',
      };

      const updated: DepartmentModel = {
        id,
        name: dto.name!,
        description: dto.description!,
      };

      departmentsRepo.update.mockResolvedValue(updated);

      const result = await service.update(id, dto);

      expect(departmentsRepo.update).toHaveBeenCalledWith(id, {
        name: dto.name,
        description: dto.description,
      });
      expect(result).toEqual(updated);
    });

    it('should pass description as undefined when dto.description is undefined', async () => {
      const id = 1;
      const dto: UpdateDepartmentDto = {
        name: 'New IT',
      };

      const updated: DepartmentModel = {
        id,
        name: dto.name!,
        description: 'kept old description',
      };

      departmentsRepo.update.mockResolvedValue(updated);

      const result = await service.update(id, dto);

      expect(departmentsRepo.update).toHaveBeenCalledWith(id, {
        name: dto.name,
        description: undefined,
      });
      expect(result).toEqual(updated);
    });

    it('should throw NotFoundException when department to update does not exist', async () => {
      const id = 999;
      const dto: UpdateDepartmentDto = {
        name: 'Does not matter',
        description: 'Does not matter',
      };

      departmentsRepo.update.mockResolvedValue(null);

      await expect(service.update(id, dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      await expect(service.update(id, dto)).rejects.toThrow(
        `Department with id ${id} not found`,
      );
    });
  });

  describe('remove', () => {
    it('should call repository.delete and not throw when delete returns true', async () => {
      const id = 1;
      departmentsRepo.delete.mockResolvedValue(true);

      await expect(service.remove(id)).resolves.toBeUndefined();
      expect(departmentsRepo.delete).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException when delete returns false', async () => {
      const id = 999;
      departmentsRepo.delete.mockResolvedValue(false);

      await expect(service.remove(id)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      await expect(service.remove(id)).rejects.toThrow(
        `Department with id ${id} not found`,
      );
    });
  });
});
