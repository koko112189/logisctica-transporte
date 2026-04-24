export class GetVehicleByIdQuery {
  constructor(
    public readonly vehicleId: string,
    public readonly tenantId: string,
  ) {}
}
