export class ExternalCarrier {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly legalName: string,
    public readonly taxId: string,
    public readonly contactName: string,
    public readonly contactEmail: string,
    public readonly phone: string,
    public readonly notes: string,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
