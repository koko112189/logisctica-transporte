export class RejectLiquidationCommand {
  constructor(
    public readonly liquidationId: string,
    public readonly tenantId: string,
  ) {}
}
