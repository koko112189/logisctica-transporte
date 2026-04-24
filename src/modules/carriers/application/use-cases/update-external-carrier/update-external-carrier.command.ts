export class UpdateExternalCarrierCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly isActive: boolean | undefined,
    public readonly contactName: string | undefined,
    public readonly contactEmail: string | undefined,
    public readonly phone: string | undefined,
    public readonly notes: string | undefined,
  ) {}
}
