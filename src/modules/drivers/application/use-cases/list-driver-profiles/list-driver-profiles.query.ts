export class ListDriverProfilesQuery {
  constructor(
    public readonly tenantId: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
