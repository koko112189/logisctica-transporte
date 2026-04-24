export class CreateTripLiquidationCommand {
  constructor(
    public readonly tenantId: string,
    public readonly tripId: string,
    public readonly totalMerchandiseValue: number,
    public readonly driverCommission: number,
  ) {}
}
