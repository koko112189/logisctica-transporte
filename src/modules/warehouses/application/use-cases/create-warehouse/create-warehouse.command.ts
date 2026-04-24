export class CreateWarehouseCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly address: string,
    public readonly city: string,
    public readonly notificationEmail: string,
    public readonly phone: string,
    public readonly lat: number | null,
    public readonly lng: number | null,
    public readonly alertOnTripDispatch: boolean,
  ) {}
}
