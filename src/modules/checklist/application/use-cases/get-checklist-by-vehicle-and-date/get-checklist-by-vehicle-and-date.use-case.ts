import { Inject, Injectable } from '@nestjs/common';
import type { DailyChecklist } from '../../../domain/entities/daily-checklist.entity';
import { ChecklistNotFoundError } from '../../../domain/errors/checklist.errors';
import type { ChecklistRepositoryPort } from '../../../domain/ports/checklist.repository.port';
import { CHECKLIST_REPOSITORY } from '../../../checklist.di-tokens';
import { GetChecklistByVehicleAndDateQuery } from './get-checklist-by-vehicle-and-date.query';

@Injectable()
export class GetChecklistByVehicleAndDateUseCase {
  constructor(
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklists: ChecklistRepositoryPort,
  ) {}

  async execute(
    query: GetChecklistByVehicleAndDateQuery,
  ): Promise<DailyChecklist> {
    const checklist = await this.checklists.findByVehicleAndDate(
      query.vehicleId,
      query.tenantId,
      query.date,
    );
    if (!checklist) {
      throw new ChecklistNotFoundError(`${query.vehicleId}/${query.date}`);
    }
    return checklist;
  }
}
