export class CreateDomiciliaryProfileCommand {
  constructor(
    public readonly tenantId: string,
    public readonly userId: string,
    public readonly fullName: string,
    public readonly phone: string,
    public readonly documentId: string,
    public readonly linkedExternalVehicleId: string | null,
  ) {}
}
