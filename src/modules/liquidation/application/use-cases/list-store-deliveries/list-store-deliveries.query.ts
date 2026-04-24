export class ListStoreDeliveriesQuery {
  constructor(
    public readonly tripId: string,
    public readonly tenantId: string,
  ) {}
}
