export class AddRepairCommand {
  constructor(
    public readonly vehicleId: string,
    public readonly tenantId: string,
    public readonly description: string,
    public readonly date: Date,
    public readonly cost: number | null,
    public readonly mechanic: string | null,
    public readonly notes: string | null,
  ) {}
}
