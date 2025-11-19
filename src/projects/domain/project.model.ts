export class ProjectModel {
  constructor(
    public id: number | null,
    public name: string,
    public description: string | null,
    public startDate: string | null,
    public endDate: string | null,
  ) {}
}
