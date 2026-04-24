import type { ChecklistStatus } from '../../../domain/enums/checklist-status.enum';

export class ListChecklistsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly vehicleId?: string,
    public readonly driverId?: string,
    public readonly status?: ChecklistStatus,
    public readonly dateFrom?: string,
    public readonly dateTo?: string,
  ) {}
}
