import { Inject, Injectable } from '@nestjs/common';
import type { ChecklistRepositoryPort } from '../../../domain/ports/checklist.repository.port';
import { CHECKLIST_REPOSITORY } from '../../../checklist.di-tokens';
import { ListChecklistsQuery } from './list-checklists.query';
import { ListChecklistsResult } from './list-checklists.result';

@Injectable()
export class ListChecklistsUseCase {
  constructor(
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklists: ChecklistRepositoryPort,
  ) {}

  async execute(query: ListChecklistsQuery): Promise<ListChecklistsResult> {
    const skip = (query.page - 1) * query.limit;
    const { items, total } = await this.checklists.list(
      query.tenantId,
      {
        vehicleId: query.vehicleId,
        driverId: query.driverId,
        status: query.status,
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
      },
      skip,
      query.limit,
    );
    return new ListChecklistsResult(items, total, query.page, query.limit);
  }
}
