export class DeactivatePickupPointCommand {
  constructor(
    public readonly pickupPointId: string,
    public readonly tenantId: string,
  ) {}
}
