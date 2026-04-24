export class UpdateDomiciliaryProfileCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly isActive: boolean | undefined,
    public readonly phone: string | undefined,
    public readonly linkedExternalVehicleId: string | null | undefined,
  ) {}
}
