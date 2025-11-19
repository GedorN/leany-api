import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../entities/employee.entity';
import { EmployeeModel } from '../domain/employee.model';

@Injectable()
export class EmployeesRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  private toModel(entity: Employee): EmployeeModel {
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
    role: string;
    salary: number;
    isActive: boolean;
    departmentId: number | null;
  }): Promise<EmployeeModel> {
    const entity = this.employeeRepo.create({
      name: data.name,
      role: data.role,
      salary: data.salary,
      isActive: data.isActive,
      departmentId: data.departmentId,
    });

    const saved = await this.employeeRepo.save(entity);
    return this.toModel(saved);
  }

  async findAll(): Promise<EmployeeModel[]> {
    const entities = await this.employeeRepo.find();
    return entities.map((e) => this.toModel(e));
  }

  async findById(id: number): Promise<EmployeeModel | null> {
    const entity = await this.employeeRepo.findOne({ where: { id } });
    if (!entity) return null;
    return this.toModel(entity);
  }

  async update(
    id: number,
    data: Partial<{
      name: string;
      role: string;
      salary: number;
      isActive: boolean;
      departmentId: number | null;
    }>,
  ): Promise<EmployeeModel | null> {
    const entity = await this.employeeRepo.findOne({ where: { id } });
    if (!entity) return null;

    if (data.name !== undefined) entity.name = data.name;
    if (data.role !== undefined) entity.role = data.role;
    if (data.salary !== undefined) entity.salary = data.salary;
    if (data.isActive !== undefined) entity.isActive = data.isActive;
    if (data.departmentId !== undefined) entity.departmentId = data.departmentId;

    const saved = await this.employeeRepo.save(entity);
    return this.toModel(saved);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.employeeRepo.delete(id);
    return result.affected !== 0;
  }
}
