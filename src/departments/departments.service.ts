import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentsRepository } from './repositories/departments.repository';
import { DepartmentModel } from './domain/department.model';

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly departmentsRepo: DepartmentsRepository,
  ) {}

  create(dto: CreateDepartmentDto): Promise<DepartmentModel> {
    return this.departmentsRepo.create({
      name: dto.name,
      description: dto.description ?? null,
    });
  }

  findAll(): Promise<DepartmentModel[]> {
    return this.departmentsRepo.findAll();
  }

  async findOne(id: number): Promise<DepartmentModel> {
    const dep = await this.departmentsRepo.findById(id);
    if (!dep) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
    return dep;
  }

  async update(
    id: number,
    dto: UpdateDepartmentDto,
  ): Promise<DepartmentModel> {
    const updated = await this.departmentsRepo.update(id, {
      name: dto.name,
      description:
        dto.description !== undefined ? dto.description : undefined,
    });

    if (!updated) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }

    return updated;
  }

  async remove(id: number): Promise<void> {
    const ok = await this.departmentsRepo.delete(id);
    if (!ok) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
  }
}
