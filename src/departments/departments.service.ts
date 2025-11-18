import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

  create(dto: CreateDepartmentDto): Promise<Department> {
    const department = this.departmentRepo.create(dto);
    return this.departmentRepo.save(department);
  }

  findAll(): Promise<Department[]> {
    return this.departmentRepo.find();
  }

  async findOne(id: number): Promise<Department> {
    const dep = await this.departmentRepo.findOne({ where: { id } });

    if (!dep) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }

    return dep;
  }

  async update(
    id: number,
    dto: UpdateDepartmentDto,
  ): Promise<Department> {
    const dep = await this.findOne(id);
    const merged = this.departmentRepo.merge(dep, dto);
    return this.departmentRepo.save(merged);
  }

  async remove(id: number): Promise<void> {
    const result = await this.departmentRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Department with id ${id} not found`);
    }
  }
}
