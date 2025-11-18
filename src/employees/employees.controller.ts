import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { EmployeeDetailsDto } from './dto/employee-details.dto';
import { ApiOkResponse } from '@nestjs/swagger';



@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new employee' })
  @ApiResponse({ status: 201, description: 'Employee successfully created' })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lists all employees' })
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search a employee by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a employee' })
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateEmployeeDto: UpdateEmployeeDto
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a employee' })
  remove(@Param('id', ParseIntPipe) id: number) {
    this.employeesService.remove(id);
    return { message: `Employee ${id} removed` };
  }

  @Post(':id/profile')
  @ApiOperation({ summary: 'Create an employee profile' })
  createProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateEmployeeProfileDto,
  ) {
    return this.employeesService.createProfile(id, dto);
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Search employee profile by ID' })
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.getProfile(id);
  }

  @Patch(':id/profile')
  @ApiOperation({ summary: 'Update an employee profile' })
  updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeProfileDto,
  ) {
    return this.employeesService.updateProfile(id, dto);
  }

  @Delete(':id/profile')
  @ApiOperation({ summary: 'Remove an employee profile' })
  deleteProfile(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.deleteProfile(id);
  }

  @Get(':id/details')
  @ApiOperation({
    summary: 'Return an employee with full data',
  })
  @ApiOkResponse({ type: EmployeeDetailsDto })
  getDetails(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.getDetails(id);
  }

}
