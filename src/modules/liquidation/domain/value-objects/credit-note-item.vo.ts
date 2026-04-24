export class CreditNoteItem {
  constructor(
    public readonly description: string,
    public readonly quantity: number,
    public readonly unitValue: number,
    public readonly totalValue: number,
  ) {}
}
