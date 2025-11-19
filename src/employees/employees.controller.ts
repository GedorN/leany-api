import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateEmployeeProfileDto } from './dto/create-employee-profile.dto';
import { UpdateEmployeeProfileDto } from './dto/update-employee-profile.dto';
import { EmployeeDetailsDto } from './dto/employee-details.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { EmployeeResponseDto } from './dto/employee-response.dto';
import { EmployeeProfileResponseDto } from './dto/employee-profile-response.dto';
import { EmployeeDetailsResponseDto } from './dto/employee-details-response.dto';



@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @ApiOperation({ summary: 'Creates a new employee' })
  @ApiCreatedResponse({ type: EmployeeResponseDto })
  async create(@Body() createEmployeeDto: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    const model = await this.employeesService.create(createEmployeeDto);
    return EmployeeResponseDto.fromModel(model);
  }

  @Get()
  @ApiOperation({ summary: 'Lists all employees' })
  @ApiOkResponse({ type: EmployeeResponseDto, isArray: true })
  async findAll(): Promise<EmployeeResponseDto[]> {
    const models = await this.employeesService.findAll();
    return models.map(EmployeeResponseDto.fromModel);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search a employee by ID' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmployeeResponseDto> {
    const model = await this.employeesService.findOne(id);
    return EmployeeResponseDto.fromModel(model);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a employee' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    const model = await this.employeesService.update(id, dto);
    return EmployeeResponseDto.fromModel(model);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Remove a employee' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.employeesService.remove(id);
  }

  @Post(':id/profile')
  @ApiOperation({ summary: 'Create an employee profile' })
  @ApiOkResponse({ type: EmployeeProfileResponseDto })
  async createProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateEmployeeProfileDto,
  ): Promise<EmployeeProfileResponseDto> {
    const model = await this.employeesService.createProfile(id, dto);
    return EmployeeProfileResponseDto.fromModel(model);
  }

  @Get(':id/profile')
  @ApiOperation({ summary: 'Search employee profile by ID' })
  @ApiOkResponse({ type: EmployeeProfileResponseDto })
  async getProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmployeeProfileResponseDto> {
    const model = await this.employeesService.getProfile(id);
    return EmployeeProfileResponseDto.fromModel(model);
  }

  @Patch(':id/profile')
  @ApiOperation({ summary: 'Update an employee profile' })
  @ApiOkResponse({ type: EmployeeProfileResponseDto })
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployeeProfileDto,
  ): Promise<EmployeeProfileResponseDto> {
    const model = await this.employeesService.updateProfile(id, dto);
    return EmployeeProfileResponseDto.fromModel(model);
  }

  @Delete(':id/profile')
  @ApiOperation({ summary: 'Removes an employee profile' })
  async deleteProfile(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.employeesService.deleteProfile(id);
  }

  @Get(':id/details')
  @ApiOperation({
    summary: 'Return an employee with full data',
  })
  @ApiOkResponse({ type: EmployeeDetailsResponseDto })
  async getDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EmployeeDetailsResponseDto> {
    const model = await this.employeesService.getDetails(id);
    return EmployeeDetailsResponseDto.fromModel(model);
  }

}
