import { Inject, Injectable } from '@nestjs/common';
import type { DailyChecklist } from '../../../domain/entities/daily-checklist.entity';
import { ChecklistNotFoundError } from '../../../domain/errors/checklist.errors';
import type { ChecklistRepositoryPort } from '../../../domain/ports/checklist.repository.port';
import { CHECKLIST_REPOSITORY } from '../../../checklist.di-tokens';
import { GetChecklistByIdQuery } from './get-checklist-by-id.query';

@Injectable()
export class GetChecklistByIdUseCase {
  constructor(
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklists: ChecklistRepositoryPort,
  ) {}

  async execute(query: GetChecklistByIdQuery): Promise<DailyChecklist> {
    const checklist = await this.checklists.findById(
      query.checklistId,
      query.tenantId,
    );
    if (!checklist) throw new ChecklistNotFoundError(query.checklistId);
    return checklist;
  }
}
