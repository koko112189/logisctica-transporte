export class ListUsersQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
    public readonly tenantId: string | null,
    public readonly listAllUsers: boolean,
  ) {}
}
