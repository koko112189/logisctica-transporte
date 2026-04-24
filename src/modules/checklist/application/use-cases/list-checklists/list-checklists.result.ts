import type { DailyChecklist } from '../../../domain/entities/daily-checklist.entity';

export class ListChecklistsResult {
  constructor(
    public readonly items: DailyChecklist[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
