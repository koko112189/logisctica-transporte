export class GetChecklistByIdQuery {
  constructor(
    public readonly checklistId: string,
    public readonly tenantId: string,
  ) {}
}
