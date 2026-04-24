export class DomiciliaryProfile {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly userId: string,
    public readonly fullName: string,
    public readonly phone: string,
    public readonly documentId: string,
    public readonly linkedExternalVehicleId: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
