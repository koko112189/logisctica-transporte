export class GetTripRouteQuery {
  constructor(
    public readonly tripId: string,
    public readonly tenantId: string,
  ) {}
}
