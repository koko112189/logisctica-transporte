import { Inject, Injectable } from '@nestjs/common';
import { StoreDeliveryNotFoundError } from '../../../domain/errors/liquidation.errors';
import type { StoreDeliveryRepositoryPort } from '../../../domain/ports/store-delivery.repository.port';
import { STORE_DELIVERY_REPOSITORY } from '../../../liquidation.di-tokens';
import { CompleteDeliveryCommand } from './complete-delivery.command';

@Injectable()
export class CompleteDeliveryUseCase {
  constructor(
    @Inject(STORE_DELIVERY_REPOSITORY)
    private readonly deliveries: StoreDeliveryRepositoryPort,
  ) {}

  async execute(command: CompleteDeliveryCommand): Promise<void> {
    const delivery = await this.deliveries.findById(command.deliveryId, command.tenantId);
    if (!delivery) throw new StoreDeliveryNotFoundError(command.deliveryId);
    await this.deliveries.save(delivery.markDelivered(command.receivedByName, new Date()));
  }
}
