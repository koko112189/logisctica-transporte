import type { ChecklistItem } from '../value-objects/checklist-item.vo';
import type { ChecklistStatus } from '../enums/checklist-status.enum';
import type { ChecklistTemplate } from '../enums/checklist-template.enum';
import type { FuelLevel } from '../enums/fuel-level.enum';
import { ChecklistStatus as CS } from '../enums/checklist-status.enum';

export class DailyChecklist {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly vehicleId: string,
    public readonly driverId: string,
    public readonly date: string,             // 'YYYY-MM-DD'
    public readonly items: ChecklistItem[],
    public readonly fuelLevel: FuelLevel | null,
    public readonly previousTasksConfirmed: boolean,
    public readonly generalObservations: string,
    public readonly checklistTemplate: ChecklistTemplate,
    public readonly status: ChecklistStatus,
    public readonly submittedAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  submit(
    items: ChecklistItem[],
    fuelLevel: FuelLevel,
    previousTasksConfirmed: boolean,
    generalObservations: string,
  ): DailyChecklist {
    return new DailyChecklist(
      this.id, this.tenantId, this.vehicleId, this.driverId, this.date,
      items, fuelLevel, previousTasksConfirmed, generalObservations,
      this.checklistTemplate, CS.COMPLETED, new Date(), this.createdAt,
    );
  }
}
