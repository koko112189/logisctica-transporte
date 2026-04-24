export class CompleteTripCommand {
  constructor(
    public readonly tripId: string,
    public readonly tenantId: string,
  ) {}
}
