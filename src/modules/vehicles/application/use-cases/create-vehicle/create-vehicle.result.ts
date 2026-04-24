export class CreateVehicleResult {
  constructor(
    public readonly vehicleId: string,
    public readonly driverUserId: string,
    public readonly driverEmail: string,
    public readonly driverTemporaryPassword: string,
  ) {}
}
