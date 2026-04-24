export class CompleteDeliveryCommand {
  constructor(
    public readonly deliveryId: string,
    public readonly tenantId: string,
    public readonly receivedByName: string,
  ) {}
}
