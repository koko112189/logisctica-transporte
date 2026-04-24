export class UpdateTripLocationCommand {
  constructor(
    public readonly tripId: string,
    public readonly tenantId: string,
    public readonly lat: number,
    public readonly lng: number,
  ) {}
}
