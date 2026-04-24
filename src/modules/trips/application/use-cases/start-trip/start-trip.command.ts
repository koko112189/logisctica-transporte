export class StartTripCommand {
  constructor(
    public readonly tripId: string,
    public readonly tenantId: string,
  ) {}
}
