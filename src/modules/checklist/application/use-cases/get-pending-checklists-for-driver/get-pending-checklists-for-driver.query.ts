export class GetPendingChecklistsForDriverQuery {
  constructor(
    public readonly driverId: string,
    public readonly tenantId: string,
  ) {}
}
