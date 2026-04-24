export class SubmitLiquidationCommand {
  constructor(
    public readonly liquidationId: string,
    public readonly tenantId: string,
  ) {}
}
