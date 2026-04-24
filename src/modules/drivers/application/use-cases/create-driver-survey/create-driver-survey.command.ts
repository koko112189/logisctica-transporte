export class CreateDriverSurveyCommand {
  constructor(
    public readonly tenantId: string,
    public readonly driverId: string,
    public readonly vehicleId: string,
    public readonly date: string, // 'YYYY-MM-DD'
  ) {}
}
