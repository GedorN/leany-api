import { Test, TestingModule } from '@nestjs/testing';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';

import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { EmployeeProfileResponseDto } from './dto/employee-profile-response.dto';
import { EmployeeDetailsResponseDto } from './dto/employee-details-response.dto';

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let service: jest.Mocked<EmployeesService>;

  beforeEach(async () => {
    const serviceMock: jest.Mocked<EmployeesService> = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      createProfile: jest.fn(),
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
      deleteProfile: jest.fn(),
      getDetails: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeesController],
      providers: [
        {
          provide: EmployeesService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    service = module.get(EmployeesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return EmployeeResponseDto', async () => {
      const dto = {
        name: 'John Doe',
        departmentId: 1,
      } as CreateEmployeeDto;

      const model = {
        id: 1,
        name: 'John Doe',
        departmentId: 1,
      } as any;

      service.create.mockResolvedValue(model);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(EmployeeResponseDto.fromModel(model));
    });
  });

  describe('findAll', () => {
    it('should return a list of EmployeeResponseDto', async () => {
      const models = [
        { id: 1, name: 'John Doe', departmentId: 1 },
        { id: 2, name: 'Jane Doe', departmentId: 2 },
      ] as any[];

      service.findAll.mockResolvedValue(models);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(models.map(EmployeeResponseDto.fromModel));
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with id and return EmployeeResponseDto', async () => {
      const id = 1;
      const model = { id, name: 'John Doe', departmentId: 1 } as any;

      service.findOne.mockResolvedValue(model);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(EmployeeResponseDto.fromModel(model));
    });
  });

  describe('update', () => {
    it('should call service.update and return EmployeeResponseDto', async () => {
      const id = 1;
      const dto = { name: 'Updated Name' } as UpdateEmployeeDto;

      const model = { id, name: 'Updated Name', departmentId: 1 } as any;
      service.update.mockResolvedValue(model);

      const result = await controller.update(id, dto);

      expect(service.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(EmployeeResponseDto.fromModel(model));
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

  describe('createProfile', () => {
    it('should call service.createProfile and return EmployeeProfileResponseDto', async () => {
      const id = 1;
      const dto = {
        bio: 'Some bio',
      } as CreateEmployeeProfileDto;

      const model = { id: 10, employeeId: id, bio: 'Some bio' } as any;
      service.createProfile.mockResolvedValue(model);

      const result = await controller.createProfile(id, dto);

      expect(service.createProfile).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(EmployeeProfileResponseDto.fromModel(model));
    });
  });

  describe('getProfile', () => {
    it('should call service.getProfile and return EmployeeProfileResponseDto', async () => {
      const id = 1;
      const model = { id: 10, employeeId: id, bio: 'Some bio' } as any;

      service.getProfile.mockResolvedValue(model);

      const result = await controller.getProfile(id);

      expect(service.getProfile).toHaveBeenCalledWith(id);
      expect(result).toEqual(EmployeeProfileResponseDto.fromModel(model));
    });
  });

  describe('updateProfile', () => {
    it('should call service.updateProfile and return EmployeeProfileResponseDto', async () => {
      const id = 1;
      const dto = { bio: 'Updated bio' } as UpdateEmployeeProfileDto;

      const model = { id: 10, employeeId: id, bio: 'Updated bio' } as any;
      service.updateProfile.mockResolvedValue(model);

      const result = await controller.updateProfile(id, dto);

      expect(service.updateProfile).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(EmployeeProfileResponseDto.fromModel(model));
    });
  });

  describe('deleteProfile', () => {
    it('should call service.deleteProfile with id', async () => {
      const id = 1;
      service.deleteProfile.mockResolvedValue(undefined);

      await controller.deleteProfile(id);

      expect(service.deleteProfile).toHaveBeenCalledWith(id);
    });
  });

  describe('getDetails', () => {
  it('should call service.getDetails and return EmployeeDetailsResponseDto', async () => {
    const id = 1;

    const model = {
      employee: {
        id,
        name: 'Gedor Neto',
        role: 'Backend Developer',
        salary: 1000,
        departmentId: 1,
      },
      profile: {
        id: 10,
        employeeId: id,
        bio: 'Some bio',
      },
      department: {
        id: 1,
        name: 'IT',
      },
      projects: [],
    } as any;

    service.getDetails.mockResolvedValue(model);

    const result = await controller.getDetails(id);

    expect(service.getDetails).toHaveBeenCalledWith(id);
    expect(result).toEqual(EmployeeDetailsResponseDto.fromModel(model));
    });
  });

});
