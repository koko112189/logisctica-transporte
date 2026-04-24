import { Inject, Injectable } from '@nestjs/common';
import type { PickupPoint } from '../../../domain/entities/pickup-point.entity';
import { PickupPointNotFoundError } from '../../../domain/errors/pickup-point.errors';
import type { PickupPointRepositoryPort } from '../../../domain/ports/pickup-point.repository.port';
import { PICKUP_POINT_REPOSITORY } from '../../../route-points.di-tokens';
import { GetPickupPointByIdQuery } from './get-pickup-point-by-id.query';

@Injectable()
export class GetPickupPointByIdUseCase {
  constructor(
    @Inject(PICKUP_POINT_REPOSITORY)
    private readonly points: PickupPointRepositoryPort,
  ) {}

  async execute(query: GetPickupPointByIdQuery): Promise<PickupPoint> {
    const point = await this.points.findById(query.pickupPointId, query.tenantId);
    if (!point) throw new PickupPointNotFoundError(query.pickupPointId);
    return point;
  }
}
