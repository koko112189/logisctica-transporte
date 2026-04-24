export class UpdateWarehouseCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string | undefined,
    public readonly address: string | undefined,
    public readonly city: string | undefined,
    public readonly notificationEmail: string | undefined,
    public readonly phone: string | undefined,
    public readonly lat: number | null | undefined,
    public readonly lng: number | null | undefined,
    public readonly alertOnTripDispatch: boolean | undefined,
    public readonly isActive: boolean | undefined,
  ) {}
}
