import type { TripLiquidation } from '../entities/trip-liquidation.entity';

export interface TripLiquidationRepositoryPort {
  save(liquidation: TripLiquidation): Promise<void>;
  findById(id: string, tenantId: string): Promise<TripLiquidation | null>;
  findByTrip(tripId: string, tenantId: string): Promise<TripLiquidation | null>;
  findAll(tenantId: string, page: number, limit: number): Promise<{ items: TripLiquidation[]; total: number }>;
}
