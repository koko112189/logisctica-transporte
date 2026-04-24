import { Inject, Injectable } from '@nestjs/common';
import type { TripLiquidation } from '../../../domain/entities/trip-liquidation.entity';
import type { TripLiquidationRepositoryPort } from '../../../domain/ports/trip-liquidation.repository.port';
import { TRIP_LIQUIDATION_REPOSITORY } from '../../../liquidation.di-tokens';
import { GetLiquidationByTripQuery } from './get-liquidation-by-trip.query';

@Injectable()
export class GetLiquidationByTripUseCase {
  constructor(
    @Inject(TRIP_LIQUIDATION_REPOSITORY)
    private readonly liquidations: TripLiquidationRepositoryPort,
  ) {}

  async execute(query: GetLiquidationByTripQuery): Promise<TripLiquidation | null> {
    return this.liquidations.findByTrip(query.tripId, query.tenantId);
  }
}
