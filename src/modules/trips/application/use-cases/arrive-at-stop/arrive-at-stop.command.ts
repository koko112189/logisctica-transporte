export class ArriveAtStopCommand {
  constructor(
    public readonly tripId: string,
    public readonly tenantId: string,
    public readonly stopOrder: number,
  ) {}
}
