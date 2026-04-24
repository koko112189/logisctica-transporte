export class Repair {
  constructor(
    public readonly id: string,
    public readonly description: string,
    public readonly date: Date,
    public readonly cost: number | null,
    public readonly mechanic: string | null,
    public readonly notes: string | null,
  ) {}
}
