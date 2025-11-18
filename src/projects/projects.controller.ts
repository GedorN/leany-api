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
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lists all projects' })
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Search a project by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Removes a project' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }

  @Post(':projectId/employees/:employeeId')
  @ApiOperation({ summary: 'Add an employee to a project' })
  addEmployee(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.projectsService.addEmployeeToProject(projectId, employeeId);
  }

  @Delete(':projectId/employees/:employeeId')
  @ApiOperation({ summary: 'Removes an employee from a project' })
  removeEmployee(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('employeeId', ParseIntPipe) employeeId: number,
  ) {
    return this.projectsService.removeEmployeeFromProject(
      projectId,
      employeeId,
    );
  }

  @Get(':projectId/employees')
  @ApiOperation({ summary: 'Lists all employees from a project' })
  listEmployees(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.projectsService.listEmployeesInProject(projectId);
  }
}
