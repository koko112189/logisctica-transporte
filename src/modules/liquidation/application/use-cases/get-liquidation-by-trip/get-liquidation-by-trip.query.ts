export class GetLiquidationByTripQuery {
  constructor(
    public readonly tripId: string,
    public readonly tenantId: string,
  ) {}
}
