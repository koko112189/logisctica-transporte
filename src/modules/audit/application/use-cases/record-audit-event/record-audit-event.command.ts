export class RecordAuditEventCommand {
  constructor(
    public readonly eventName: string,
    public readonly payload: Record<string, unknown>,
  ) {}
}
