import { Warehouse } from '../entities/warehouse.entity';

export interface WarehouseRepositoryPort {
  save(w: Warehouse): Promise<void>;
  findById(id: string, tenantId: string): Promise<Warehouse | null>;
  list(tenantId: string, page: number, limit: number, activeOnly: boolean): Promise<{ items: Warehouse[]; total: number }>;
}
