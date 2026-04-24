export class GetPickupPointByIdQuery {
  constructor(
    public readonly pickupPointId: string,
    public readonly tenantId: string,
  ) {}
}
