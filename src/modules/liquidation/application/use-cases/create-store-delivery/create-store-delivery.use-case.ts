import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { StoreDelivery } from '../../../domain/entities/store-delivery.entity';
import { DeliveryStatus } from '../../../domain/enums/delivery-status.enum';
import type { StoreDeliveryRepositoryPort } from '../../../domain/ports/store-delivery.repository.port';
import { STORE_DELIVERY_REPOSITORY } from '../../../liquidation.di-tokens';
import { CreateStoreDeliveryCommand } from './create-store-delivery.command';

@Injectable()
export class CreateStoreDeliveryUseCase {
  constructor(
    @Inject(STORE_DELIVERY_REPOSITORY)
    private readonly deliveries: StoreDeliveryRepositoryPort,
  ) {}

  async execute(command: CreateStoreDeliveryCommand): Promise<{ deliveryId: string }> {
    const now = new Date();
    const delivery = new StoreDelivery(
      randomUUID(),
      command.tenantId,
      command.tripId,
      command.tripStopOrder,
      command.pickupPointId,
      command.supplies,
      command.merchandiseValue,
      null,
      DeliveryStatus.PENDING,
      command.observations,
      null,
      null,
      now,
      now,
    );
    await this.deliveries.save(delivery);
    return { deliveryId: delivery.id };
  }
}
