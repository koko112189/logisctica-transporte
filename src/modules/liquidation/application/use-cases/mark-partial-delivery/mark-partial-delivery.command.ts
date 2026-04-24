export class MarkPartialDeliveryCommand {
  constructor(
    public readonly deliveryId: string,
    public readonly tenantId: string,
    public readonly observations: string,
  ) {}
}
