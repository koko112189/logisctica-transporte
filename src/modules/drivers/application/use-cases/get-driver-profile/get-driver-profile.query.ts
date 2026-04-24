export class GetDriverProfileQuery {
  constructor(
    public readonly profileId: string,
    public readonly tenantId: string,
  ) {}
}
