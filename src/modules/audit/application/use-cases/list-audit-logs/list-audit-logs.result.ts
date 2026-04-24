export class AuditLogItem {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly eventName: string,
    public readonly payload: Record<string, unknown>,
    public readonly userId: string | null,
    public readonly createdAt: Date,
  ) {}
}

export class ListAuditLogsResult {
  constructor(
    public readonly items: AuditLogItem[],
    public readonly total: number,
  ) {}
}
