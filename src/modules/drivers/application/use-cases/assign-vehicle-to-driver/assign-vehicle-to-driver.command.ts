export class AssignVehicleToDriverCommand {
  constructor(
    public readonly profileId: string,
    public readonly tenantId: string,
    public readonly vehicleId: string,
  ) {}
}
