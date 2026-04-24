import { Inject, Injectable } from '@nestjs/common';
import { PickupPointNotFoundError } from '../../../domain/errors/pickup-point.errors';
import type { PickupPointRepositoryPort } from '../../../domain/ports/pickup-point.repository.port';
import { PICKUP_POINT_REPOSITORY } from '../../../route-points.di-tokens';
import { DeactivatePickupPointCommand } from './deactivate-pickup-point.command';

@Injectable()
export class DeactivatePickupPointUseCase {
  constructor(
    @Inject(PICKUP_POINT_REPOSITORY)
    private readonly points: PickupPointRepositoryPort,
  ) {}

  async execute(command: DeactivatePickupPointCommand): Promise<void> {
    const point = await this.points.findById(command.pickupPointId, command.tenantId);
    if (!point) throw new PickupPointNotFoundError(command.pickupPointId);
    await this.points.save(point.deactivate());
  }
}
