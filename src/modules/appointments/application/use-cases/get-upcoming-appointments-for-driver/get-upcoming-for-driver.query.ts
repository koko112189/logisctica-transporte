export class GetUpcomingForDriverQuery {
  constructor(
    public readonly driverId: string,
    public readonly tenantId: string,
  ) {}
}
