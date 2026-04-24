export class ResolveDefectCommand {
  constructor(
    public readonly vehicleId: string,
    public readonly tenantId: string,
    public readonly defectId: string,
  ) {}
}
