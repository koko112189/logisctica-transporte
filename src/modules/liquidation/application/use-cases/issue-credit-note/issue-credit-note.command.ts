export class IssueCreditNoteCommand {
  constructor(
    public readonly creditNoteId: string,
    public readonly tenantId: string,
  ) {}
}
