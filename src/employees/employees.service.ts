import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { EmployeesRepository } from './repositories/employees.repository';
import { EmployeeModel } from './domain/employee.model';
import { EmployeeProfilesRepository } from './repositories/employee-profiles.repository';
import { EmployeeProfileModel } from './domain/employee-profile.model';
import { EmployeeDetailsModel } from './domain/employee-details.model';
import { DepartmentsRepository } from '../departments/repositories/departments.repository';
import { ProjectsRepository } from '../projects/repositories/projects.repository';


@Injectable()
export class EmployeesService {
  constructor(
    private readonly employeesRepo: EmployeesRepository,
    private readonly departmentsRepo: DepartmentsRepository,
    private readonly employeeProfilesRepo: EmployeeProfilesRepository,
    private readonly projectsRepo: ProjectsRepository,
  ) {}

  private async ensureDepartmentExists(departmentId: number): Promise<void> {
    const dep = await this.departmentsRepo.findById(departmentId)

    if (!dep) {
      throw new BadRequestException(
        `Department with id ${departmentId} does not exist`,
      );
    }
  }


   async create(dto: CreateEmployeeDto): Promise<EmployeeModel> {
    if (dto.departmentId != null) {
      await this.ensureDepartmentExists(dto.departmentId);
    }

    return this.employeesRepo.create({
      name: dto.name,
      role: dto.role,
      salary: dto.salary,
      isActive: dto.isActive,
      departmentId: dto.departmentId ?? null,
    });
  }

  async findAll(): Promise<EmployeeModel[]> {
    return this.employeesRepo.findAll();
  }

  async findOne(id: number): Promise<EmployeeModel> {
    const employee = await this.employeesRepo.findById(id);
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
    return employee;
  }

  async update(
    id: number,
    dto: UpdateEmployeeDto,
  ): Promise<EmployeeModel> {
    if (dto.departmentId !== undefined && dto.departmentId !== null) {
      await this.ensureDepartmentExists(dto.departmentId);
    }

    const updated = await this.employeesRepo.update(id, {
      name: dto.name,
      role: dto.role,
      salary: dto.salary,
      isActive: dto.isActive,
      departmentId:
        dto.departmentId !== undefined ? dto.departmentId : undefined,
    });

    if (!updated) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return updated;
  }

  async remove(id: number): Promise<void> {
    const ok = await this.employeesRepo.delete(id);
    if (!ok) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
  }

  async getProfile(employeeId: number): Promise<EmployeeProfileModel> {
    const profile = await this.employeeProfilesRepo.findByEmployeeId(employeeId);

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
  ): Promise<EmployeeProfileModel> {
    const employee = await this.employeesRepo.findById(employeeId);
    if (!employee) {
      throw new NotFoundException(`Employee with id ${employeeId} not found`);
    }

    const existing = await this.employeeProfilesRepo.findByEmployeeId(employeeId);
    if (existing) {
      throw new BadRequestException(
        `Employee ${employeeId} already has a profile`,
      );
    }

    return this.employeeProfilesRepo.createForEmployee(employeeId, {
      birthDate: dto.birthDate,
      document: dto.document,
      address: dto.address,
    });
  }


  async updateProfile(
    employeeId: number,
    dto: UpdateEmployeeProfileDto,
  ): Promise<EmployeeProfileModel> {
    const updated = await this.employeeProfilesRepo.updateForEmployee(employeeId, {
      birthDate: dto.birthDate,
      document: dto.document,
      address: dto.address,
    });

    if (!updated) {
      throw new NotFoundException(
        `Profile for employee ${employeeId} not found`,
      );
    }

    return updated;
  }

  async deleteProfile(employeeId: number): Promise<void> {
    const ok = await this.employeeProfilesRepo.deleteForEmployee(employeeId);
    if (!ok) {
      throw new NotFoundException(
        `Profile for employee ${employeeId} not found`,
      );
    }
  }

    async getDetails(id: number): Promise<EmployeeDetailsModel> {
    const employee = await this.employeesRepo.findById(id);
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    const profile =
      (await this.employeeProfilesRepo.findByEmployeeId(id)) ?? null;

    let department = null;
    if (employee.departmentId != null) {
      department =
        (await this.departmentsRepo.findById(employee.departmentId)) ?? null;
    }

    const projects = await this.projectsRepo.listProjectsForEmployee(id);

    return new EmployeeDetailsModel(employee, profile, department, projects);
  }


}
