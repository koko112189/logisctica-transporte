export class ApproveLiquidationCommand {
  constructor(
    public readonly liquidationId: string,
    public readonly tenantId: string,
    public readonly approvedByUserId: string,
  ) {}
}
