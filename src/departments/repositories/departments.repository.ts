import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '../entities/department.entity';
import { DepartmentModel } from '../domain/department.model';

@Injectable()
export class DepartmentsRepository {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
  ) {}

  private toModel(entity: Department): DepartmentModel {
    return new DepartmentModel(
      entity.id,
      entity.name,
      entity.description ?? null,
    );
  }

  async create(data: {
    name: string;
    description?: string | null;
  }): Promise<DepartmentModel> {
    const entity = this.departmentRepo.create({
      name: data.name,
      description: data.description ?? null,
    });

    const saved = await this.departmentRepo.save(entity);
    return this.toModel(saved);
  }

  async findAll(): Promise<DepartmentModel[]> {
    const entities = await this.departmentRepo.find();
    return entities.map((e) => this.toModel(e));
  }

  async findById(id: number): Promise<DepartmentModel | null> {
    const entity = await this.departmentRepo.findOne({ where: { id } });
    return entity ? this.toModel(entity) : null;
  }

  async update(
    id: number,
    data: Partial<{ name: string; description: string | null }>,
  ): Promise<DepartmentModel | null> {
    const entity = await this.departmentRepo.findOne({ where: { id } });
    if (!entity) return null;

    if (data.name !== undefined) entity.name = data.name;
    if (data.description !== undefined) entity.description = data.description;

    const saved = await this.departmentRepo.save(entity);
    return this.toModel(saved);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.departmentRepo.delete(id);
    return result.affected !== 0;
  }
}
