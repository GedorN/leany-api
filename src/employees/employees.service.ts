import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  private employees: Employee[] = [];
  private currentId = 1;

  create(createEmployeeDto: CreateEmployeeDto): Employee {
  
    const newEmployee: Employee = {
      id: this.currentId++,
      ...createEmployeeDto,
    };

    this.employees.push(newEmployee);
    return newEmployee;
  }

  findAll(): Employee[] {
    return this.employees;
  }

  findOne(id: number): Employee {
    const employee = this.employees.find((e) => e.id === id);

    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    return employee;
  }

  update(id: number, updateEmployeeDto: UpdateEmployeeDto): Employee {
    const employee = this.findOne(id);

    const index = this.employees.findIndex((e) => e.id === id);
    const updated: Employee = { ...employee, ...updateEmployeeDto };

    this.employees[index] = updated;
    return updated;
  }


  remove(id: number): void {
    const index = this.employees.findIndex((e) => e.id === id);

    if (index === -1) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }

    this.employees.splice(index, 1);
  }
}
