export class GetChecklistByVehicleAndDateQuery {
  constructor(
    public readonly vehicleId: string,
    public readonly tenantId: string,
    public readonly date: string, // 'YYYY-MM-DD'
  ) {}
}
