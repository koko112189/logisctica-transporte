export class CreateDailyChecklistCommand {
  constructor(
    public readonly tenantId: string,
    public readonly vehicleId: string,
    public readonly date: string, // 'YYYY-MM-DD'
  ) {}
}
