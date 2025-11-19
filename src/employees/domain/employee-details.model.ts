import { EmployeeModel } from './employee.model';
import { EmployeeProfileModel } from './employee-profile.model';
import { DepartmentModel } from '../../departments/domain/department.model';
import { ProjectModel } from '../../projects/domain/project.model';

export class EmployeeDetailsModel {
  constructor(
    public employee: EmployeeModel,
    public profile: EmployeeProfileModel | null,
    public department: DepartmentModel | null,
    public projects: ProjectModel[],
  ) {}
}
