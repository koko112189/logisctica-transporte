import { Inject, Injectable } from '@nestjs/common';
import type { DailyChecklist } from '../../../domain/entities/daily-checklist.entity';
import type { ChecklistRepositoryPort } from '../../../domain/ports/checklist.repository.port';
import { CHECKLIST_REPOSITORY } from '../../../checklist.di-tokens';
import { GetPendingChecklistsForDriverQuery } from './get-pending-checklists-for-driver.query';

@Injectable()
export class GetPendingChecklistsForDriverUseCase {
  constructor(
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklists: ChecklistRepositoryPort,
  ) {}

  async execute(
    query: GetPendingChecklistsForDriverQuery,
  ): Promise<DailyChecklist[]> {
    return this.checklists.findPendingByDriver(query.driverId, query.tenantId);
  }
}
