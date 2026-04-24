export class CreateDriverProfileCommand {
  constructor(
    public readonly tenantId: string,
    public readonly userId: string,
    public readonly licenseNumber: string,
    public readonly licenseExpiry: Date,
  ) {}
}
