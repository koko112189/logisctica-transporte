import { Inject, Injectable } from '@nestjs/common';
import { ChecklistItem } from '../../../domain/value-objects/checklist-item.vo';
import {
  ChecklistAlreadySubmittedError,
  ChecklistNotFoundError,
} from '../../../domain/errors/checklist.errors';
import type { ChecklistRepositoryPort } from '../../../domain/ports/checklist.repository.port';
import { ChecklistStatus } from '../../../domain/enums/checklist-status.enum';
import { CHECKLIST_REPOSITORY } from '../../../checklist.di-tokens';
import { SubmitChecklistCommand } from './submit-checklist.command';

@Injectable()
export class SubmitChecklistUseCase {
  constructor(
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklists: ChecklistRepositoryPort,
  ) {}

  async execute(command: SubmitChecklistCommand): Promise<void> {
    const checklist = await this.checklists.findById(
      command.checklistId,
      command.tenantId,
    );
    if (!checklist) throw new ChecklistNotFoundError(command.checklistId);
    if (checklist.status === ChecklistStatus.COMPLETED) {
      throw new ChecklistAlreadySubmittedError();
    }

    const items = command.items.map(
      (i) => new ChecklistItem(i.category, i.name, i.status, i.observation ?? null),
    );
    const submitted = checklist.submit(
      items,
      command.fuelLevel,
      command.previousTasksConfirmed,
      command.generalObservations,
    );
    await this.checklists.save(submitted);
  }
}
