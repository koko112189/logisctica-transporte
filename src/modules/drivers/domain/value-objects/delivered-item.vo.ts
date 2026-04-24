export class DeliveredItem {
  constructor(
    public readonly name: string,
    public readonly quantity: number,
    public readonly unit: string | null,
    public readonly confirmed: boolean,
    public readonly observations: string | null,
  ) {}
}
