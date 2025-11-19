export class EmployeeProfileModel {
  constructor(
    public id: number | null,
    public employeeId: number,
    public birthDate: string | null,
    public document: string | null,
    public address: string | null,
  ) {}
}
