export class GetPendingSurveysForDriverQuery {
  constructor(
    public readonly driverId: string,
    public readonly tenantId: string,
  ) {}
}
