import type { StoreDelivery } from '../entities/store-delivery.entity';

export interface StoreDeliveryRepositoryPort {
  save(delivery: StoreDelivery): Promise<void>;
  findById(id: string, tenantId: string): Promise<StoreDelivery | null>;
  findByTrip(tripId: string, tenantId: string): Promise<StoreDelivery[]>;
}
