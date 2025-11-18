import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeProfile } from './entities/employee-profile.entity';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { Department } from 'src/departments/entities/department.entity';
import { EmployeeProject } from '../projects/entities/employee-project.entity';
import { EmployeeDetailsDto } from './dto/employee-details.dto';


@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
    @InjectRepository(EmployeeProfile)
    private readonly profileRepo: Repository<EmployeeProfile>,
  ) {}

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = this.employeeRepo.create({
      name: dto.name,
      role: dto.role,
      salary: dto.salary,
      isActive: dto.isActive,
      departmentId: dto.departmentId ?? null, // <<< aqui
    });

    return this.employeeRepo.save(employee);
  }

   findAll(): Promise<Employee[]> {
    return this.employeeRepo.find();
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepo.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return employee;
  }

  async update(
    id: number,
    updateEmployeeDto: UpdateEmployeeDto,
  ): Promise<Employee> {
    const employee = await this.findOne(id);

    const updated = this.employeeRepo.merge(employee, updateEmployeeDto);
    return this.employeeRepo.save(updated);
  }

  async remove(id: number): Promise<void> {
    const result = await this.employeeRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
  }

  async getProfile(employeeId: number): Promise<EmployeeProfile> {
    const profile = await this.profileRepo.findOne({
      where: { employeeId },
    });

    if (!profile) {
      throw new NotFoundException(
        `Profile for employee ${employeeId} not found`,
      );
    }

    return profile;
  }

  async createProfile(
    employeeId: number,
    dto: CreateEmployeeProfileDto,
  ): Promise<EmployeeProfile> {
    const employee = await this.employeeRepo.findOne({ where: { id: employeeId } });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }

    const existing = await this.profileRepo.findOne({ where: { employeeId } });
    if (existing) {
      throw new BadRequestException(
        `Employee ${employeeId} already has a profile`,
      );
    }

    const profile = this.profileRepo.create({
      id: employeeId,
      employeeId,
      ...dto,
      employee,
    });

    return this.profileRepo.save(profile);
  }

  async updateProfile(
    employeeId: number,
    dto: UpdateEmployeeProfileDto,
  ): Promise<EmployeeProfile> {
    const profile = await this.profileRepo.findOne({
      where: { employeeId },
    });

    if (!profile) {
      throw new NotFoundException(
        `Profile for employee ${employeeId} not found`,
      );
    }

    const merged = this.profileRepo.merge(profile, dto);
    return this.profileRepo.save(merged);
  }

  async deleteProfile(employeeId: number): Promise<void> {
    const result = await this.profileRepo.delete({ employeeId });

    if (result.affected === 0) {
      throw new NotFoundException(
        `Profile for employee ${employeeId} not found`,
      );
    }
  }

  async getDetails(id: number): Promise<EmployeeDetailsDto> {
    const employee = await this.employeeRepo.findOne({
      where: { id },
      relations: [
        'profile',
        'department',
        'employeeProjects',
        'employeeProjects.project',
      ],
    });

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    const projects =
      employee.employeeProjects?.map((ep) => ep.project).filter(Boolean) ?? [];

    const details: EmployeeDetailsDto = {
      id: employee.id,
      name: employee.name,
      role: employee.role,
      salary: employee.salary,
      isActive: employee.isActive,
      department: employee.department ?? null,
      profile: employee.profile ?? null,
      projects,
    };

    return details;
  }

}
