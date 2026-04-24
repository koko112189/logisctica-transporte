export class CreateExternalCarrierCommand {
  constructor(
    public readonly tenantId: string,
    public readonly legalName: string,
    public readonly taxId: string,
    public readonly contactName: string,
    public readonly contactEmail: string,
    public readonly phone: string,
    public readonly notes: string,
  ) {}
}
