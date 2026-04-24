export class SupplyItem {
  constructor(
    public readonly name: string,
    public readonly quantity: number,
    public readonly unit: string,
    public readonly unitValue: number,
    public readonly totalValue: number,
  ) {}
}
