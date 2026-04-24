export class ListTenantsQuery {
  constructor(
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
