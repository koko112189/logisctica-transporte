export class UpdateDriverProfileCommand {
  constructor(
    public readonly profileId: string,
    public readonly tenantId: string,
    public readonly licenseNumber?: string,
    public readonly licenseExpiry?: Date,
  ) {}
}
