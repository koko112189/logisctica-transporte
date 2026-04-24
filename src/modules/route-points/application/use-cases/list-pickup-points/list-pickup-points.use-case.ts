import { Inject, Injectable } from '@nestjs/common';
import type { PickupPoint } from '../../../domain/entities/pickup-point.entity';
import type { PickupPointRepositoryPort } from '../../../domain/ports/pickup-point.repository.port';
import { PICKUP_POINT_REPOSITORY } from '../../../route-points.di-tokens';
import { ListPickupPointsQuery } from './list-pickup-points.query';

@Injectable()
export class ListPickupPointsUseCase {
  constructor(
    @Inject(PICKUP_POINT_REPOSITORY)
    private readonly points: PickupPointRepositoryPort,
  ) {}

  async execute(
    query: ListPickupPointsQuery,
  ): Promise<{ items: PickupPoint[]; total: number }> {
    return this.points.findAll(
      query.tenantId,
      { type: query.type, city: query.city, isActive: query.isActive },
      query.page,
      query.limit,
    );
  }
}
