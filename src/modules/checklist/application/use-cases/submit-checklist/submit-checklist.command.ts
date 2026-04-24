import type { ChecklistCategory } from '../../../domain/enums/checklist-category.enum';
import type { FuelLevel } from '../../../domain/enums/fuel-level.enum';
import type { ItemStatus } from '../../../domain/enums/item-status.enum';

export interface SubmitItemInput {
  category: ChecklistCategory;
  name: string;
  status: ItemStatus;
  observation?: string;
}

export class SubmitChecklistCommand {
  constructor(
    public readonly checklistId: string,
    public readonly tenantId: string,
    public readonly items: SubmitItemInput[],
    public readonly fuelLevel: FuelLevel,
    public readonly previousTasksConfirmed: boolean,
    public readonly generalObservations: string,
  ) {}
}
