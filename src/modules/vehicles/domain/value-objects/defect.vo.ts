import { DefectStatus } from '../enums/defect-status.enum';

export class Defect {
  constructor(
    public readonly id: string,
    public readonly description: string,
    public readonly reportedAt: Date,
    public readonly resolvedAt: Date | null,
    public readonly status: DefectStatus,
  ) {}

  resolve(resolvedAt: Date): Defect {
    return new Defect(
      this.id,
      this.description,
      this.reportedAt,
      resolvedAt,
      DefectStatus.RESOLVED,
    );
  }

  static open(id: string, description: string): Defect {
    return new Defect(id, description, new Date(), null, DefectStatus.OPEN);
  }
}
