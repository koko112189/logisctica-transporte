export class DeactivateVehicleCommand {
  constructor(
    public readonly vehicleId: string,
    public readonly tenantId: string,
  ) {}
}
