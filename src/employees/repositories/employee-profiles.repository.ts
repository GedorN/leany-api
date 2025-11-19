import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeProfile } from '../entities/employee-profile.entity';
import { EmployeeProfileModel } from '../domain/employee-profile.model';

@Injectable()
export class EmployeeProfilesRepository {
  constructor(
    @InjectRepository(EmployeeProfile)
    private readonly profileRepo: Repository<EmployeeProfile>,
  ) {}

  private toModel(entity: EmployeeProfile): EmployeeProfileModel {
    return new EmployeeProfileModel(
      entity.id,
      entity.employeeId,
      entity.birthDate ?? null,
      entity.document ?? null,
      entity.address ?? null,
    );
  }

  async findByEmployeeId(
    employeeId: number,
  ): Promise<EmployeeProfileModel | null> {
    const entity = await this.profileRepo.findOne({
      where: { employeeId },
    });
    return entity ? this.toModel(entity) : null;
  }

  async createForEmployee(
    employeeId: number,
    data: {
      birthDate?: string;
      document?: string;
      address?: string;
    },
  ): Promise<EmployeeProfileModel> {
    const entity = this.profileRepo.create({
      id: employeeId,
      employeeId,
      birthDate: data.birthDate,
      document: data.document,
      address: data.address,
    });

    const saved = await this.profileRepo.save(entity);
    return this.toModel(saved);
  }

  async updateForEmployee(
    employeeId: number,
    data: {
      birthDate?: string;
      document?: string;
      address?: string;
    },
  ): Promise<EmployeeProfileModel | null> {
    const entity = await this.profileRepo.findOne({ where: { employeeId } });
    if (!entity) return null;

    if (data.birthDate !== undefined) entity.birthDate = data.birthDate;
    if (data.document !== undefined) entity.document = data.document;
    if (data.address !== undefined) entity.address = data.address;

    const saved = await this.profileRepo.save(entity);
    return this.toModel(saved);
  }

  async deleteForEmployee(employeeId: number): Promise<boolean> {
    const result = await this.profileRepo.delete({ employeeId });
    return result.affected !== 0;
  }
}
