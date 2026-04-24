export class AddDefectCommand {
  constructor(
    public readonly vehicleId: string,
    public readonly tenantId: string,
    public readonly description: string,
  ) {}
}
