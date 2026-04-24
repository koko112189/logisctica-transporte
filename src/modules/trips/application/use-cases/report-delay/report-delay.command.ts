export class ReportDelayCommand {
  constructor(
    public readonly tripId: string,
    public readonly tenantId: string,
    public readonly reason: string,
    public readonly newEstimatedArrival: Date,
  ) {}
}
