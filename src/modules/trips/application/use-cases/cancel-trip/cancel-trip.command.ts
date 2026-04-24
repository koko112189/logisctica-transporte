export class CancelTripCommand {
  constructor(
    public readonly tripId: string,
    public readonly tenantId: string,
    public readonly reason: string,
  ) {}
}
