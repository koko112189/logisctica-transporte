import { Inject, Injectable } from '@nestjs/common';
import type { StoreDelivery } from '../../../domain/entities/store-delivery.entity';
import type { StoreDeliveryRepositoryPort } from '../../../domain/ports/store-delivery.repository.port';
import { STORE_DELIVERY_REPOSITORY } from '../../../liquidation.di-tokens';
import { ListStoreDeliveriesQuery } from './list-store-deliveries.query';

@Injectable()
export class ListStoreDeliveriesUseCase {
  constructor(
    @Inject(STORE_DELIVERY_REPOSITORY)
    private readonly deliveries: StoreDeliveryRepositoryPort,
  ) {}

  async execute(query: ListStoreDeliveriesQuery): Promise<StoreDelivery[]> {
    return this.deliveries.findByTrip(query.tripId, query.tenantId);
  }
}
