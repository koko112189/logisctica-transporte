import type { ChecklistStatus } from '../enums/checklist-status.enum';
import type { DailyChecklist } from '../entities/daily-checklist.entity';

export interface ChecklistFilters {
  vehicleId?: string;
  driverId?: string;
  status?: ChecklistStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface ChecklistRepositoryPort {
  save(checklist: DailyChecklist): Promise<void>;
  findById(id: string, tenantId: string): Promise<DailyChecklist | null>;
  findByVehicleAndDate(
    vehicleId: string,
    tenantId: string,
    date: string,
  ): Promise<DailyChecklist | null>;
  findPendingByDriver(
    driverId: string,
    tenantId: string,
  ): Promise<DailyChecklist[]>;
  list(
    tenantId: string,
    filters: ChecklistFilters,
    skip: number,
    limit: number,
  ): Promise<{ items: DailyChecklist[]; total: number }>;
}
