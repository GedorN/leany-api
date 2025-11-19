import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';

import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentResponseDto } from './dto/department-response.dto';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;
  let service: jest.Mocked<DepartmentsService>;

  beforeEach(async () => {
    const serviceMock: jest.Mocked<DepartmentsService> = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [
        {
          provide: DepartmentsService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
    service = module.get(DepartmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return DepartmentResponseDto', async () => {
      const dto: CreateDepartmentDto = {
        name: 'IT',
        description: 'Tech department',
      };

      const model = {
        id: 1,
        name: 'IT',
        description: 'Tech department',
      } as any;

      service.create.mockResolvedValue(model);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(DepartmentResponseDto.fromModel(model));
    });
  });

  describe('findAll', () => {
    it('should return a list of DepartmentResponseDto', async () => {
      const models = [
        { id: 1, name: 'IT', description: 'Tech' },
        { id: 2, name: 'HR', description: 'People' },
      ] as any[];

      service.findAll.mockResolvedValue(models);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(models.map(DepartmentResponseDto.fromModel));
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id and return DepartmentResponseDto', async () => {
      const id = 1;
      const model = { id, name: 'IT', description: 'Tech' } as any;

      service.findOne.mockResolvedValue(model);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(DepartmentResponseDto.fromModel(model));
    });
  });

  describe('update', () => {
    it('should call service.update and return DepartmentResponseDto', async () => {
      const id = 1;
      const dto: UpdateDepartmentDto = {
        name: 'New IT',
        description: 'Updated description',
      };

      const model = {
        id,
        name: dto.name,
        description: dto.description,
      } as any;

      service.update.mockResolvedValue(model);

      const result = await controller.update(id, dto);

      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(DepartmentResponseDto.fromModel(model));
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
});
