export class GetActiveTripForDriverQuery {
  constructor(
    public readonly driverId: string,
    public readonly tenantId: string,
  ) {}
}
