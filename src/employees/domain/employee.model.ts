export class EmployeeModel {
  constructor(
    public id: number | null,
    public name: string,
    public role: string,
    public salary: number,
    public isActive: boolean,
    public departmentId: number | null,
  ) {}
}
