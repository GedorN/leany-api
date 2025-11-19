import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { DepartmentResponseDto } from './dto/department-response.dto';
import { Roles } from '../auth/roles.decorator';
import { ApiSecurity } from '@nestjs/swagger';

@ApiTags('departments')
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post()
  @Roles('admin')
  @ApiSecurity('x-user-role')
  @ApiOperation({ summary: 'Create a new department' })
  @ApiCreatedResponse({ type: DepartmentResponseDto })
  async create(
    @Body() dto: CreateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    const model = await this.departmentsService.create(dto);
    return DepartmentResponseDto.fromModel(model);
  }

  @Get()
  @ApiOperation({ summary: 'List all departments' })
  @ApiOkResponse({ type: DepartmentResponseDto, isArray: true })
  async findAll(): Promise<DepartmentResponseDto[]> {
    const models = await this.departmentsService.findAll();
    return models.map(DepartmentResponseDto.fromModel);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search a department by ID' })
  @ApiOkResponse({ type: DepartmentResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DepartmentResponseDto> {
    const model = await this.departmentsService.findOne(id);
    return DepartmentResponseDto.fromModel(model);
  }

  @Patch(':id')
  @ApiSecurity('x-user-role')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a department' })
  @ApiOkResponse({ type: DepartmentResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDepartmentDto,
  ): Promise<DepartmentResponseDto> {
    const model = await this.departmentsService.update(id, dto);
    return DepartmentResponseDto.fromModel(model);
  }

  @Delete(':id')
  @ApiSecurity('x-user-role')
  @Roles('admin')
  @ApiOperation({ summary: 'Removes a department' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.departmentsService.remove(id);
  }
}