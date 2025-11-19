// src/projects/projects.controller.ts
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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { ProjectResponseDto } from './dto/project-response.dto';
import { EmployeeResponseDto } from '../employees/dto/employee-response.dto';
import { Roles } from '../auth/roles.decorator';
import { ApiSecurity } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('admin')
  @ApiSecurity('x-user-role')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiCreatedResponse({ type: ProjectResponseDto })
  async create(
    @Body() dto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
    const model = await this.projectsService.create(dto);
    return ProjectResponseDto.fromModel(model);
  }

  @Get()
  @ApiOperation({ summary: 'Lists all projects' })
  @ApiOkResponse({ type: ProjectResponseDto, isArray: true })
  async findAll(): Promise<ProjectResponseDto[]> {
    const models = await this.projectsService.findAll();
    return models.map(ProjectResponseDto.fromModel);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search a project by ID' })
  @ApiOkResponse({ type: ProjectResponseDto })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProjectResponseDto> {
    const model = await this.projectsService.findOne(id);
    return ProjectResponseDto.fromModel(model);
  }

  @Patch(':id')
  @Roles('admin')
  @ApiSecurity('x-user-role')
  @ApiOperation({ summary: 'Update a project' })
  @ApiOkResponse({ type: ProjectResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    const model = await this.projectsService.update(id, dto);
    return ProjectResponseDto.fromModel(model);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiSecurity('x-user-role')
  @ApiOperation({ summary: 'Removes a project' })
  @ApiNoContentResponse()
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.projectsService.remove(id);
  }

  @Post(':projectId/employees/:employeeId')
  @Roles('admin')
  @ApiSecurity('x-user-role')
  @ApiOperation({ summary: 'Add an employee to a project' })
  @ApiNoContentResponse()
  async addEmployee(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<void> {
    await this.projectsService.addEmployeeToProject(projectId, employeeId);
  }

  @Delete(':projectId/employees/:employeeId')
  @Roles('admin')
  @ApiSecurity('x-user-role')
  @ApiOperation({ summary: 'Removes an employee from a project' })
  @ApiNoContentResponse()
  async removeEmployee(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ): Promise<void> {
    await this.projectsService.removeEmployeeFromProject(
      projectId,
      employeeId,
    );
  }

  @Get(':projectId/employees')
  @ApiOperation({ summary: 'Lists all employees from a project' })
  @ApiOkResponse({ type: EmployeeResponseDto, isArray: true })
  async listEmployees(
    @Param('projectId', ParseIntPipe) projectId: number,
  ): Promise<EmployeeResponseDto[]> {
    const models = await this.projectsService.listEmployeesInProject(
      projectId,
    );
    return models.map(EmployeeResponseDto.fromModel);
  }
}


