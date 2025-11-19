import { ApiProperty } from '@nestjs/swagger';
import { EmployeeProfileModel } from '../domain/employee-profile.model';

export class EmployeeProfileResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  employeeId: number;

  @ApiProperty({ nullable: true, example: '1990-05-20' })
  birthDate: string | null;

  @ApiProperty({ nullable: true, example: '123.456.789-00' })
  document: string | null;

  @ApiProperty({ nullable: true, example: 'Street X, 123, district Y' })
  address: string | null;

  static fromModel(model: EmployeeProfileModel): EmployeeProfileResponseDto {
    const dto = new EmployeeProfileResponseDto();
    dto.id = model.id!;
    dto.employeeId = model.employeeId;
    dto.birthDate = model.birthDate;
    dto.document = model.document;
    dto.address = model.address;
    return dto;
  }
}
