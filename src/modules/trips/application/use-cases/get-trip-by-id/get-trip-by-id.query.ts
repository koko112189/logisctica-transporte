export class GetTripByIdQuery {
  constructor(
    public readonly tripId: string,
    public readonly tenantId: string,
  ) {}
}
