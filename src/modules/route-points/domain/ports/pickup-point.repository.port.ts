import type { PickupPoint } from '../entities/pickup-point.entity';
import type { PickupPointType } from '../enums/pickup-point-type.enum';

export interface PickupPointFilters {
  type?: PickupPointType;
  city?: string;
  isActive?: boolean;
}

export interface PickupPointRepositoryPort {
  save(point: PickupPoint): Promise<void>;
  findById(id: string, tenantId: string): Promise<PickupPoint | null>;
  findAll(
    tenantId: string,
    filters: PickupPointFilters,
    page: number,
    limit: number,
  ): Promise<{ items: PickupPoint[]; total: number }>;
}
