import { Inject, Injectable } from '@nestjs/common';
import type { Trip } from '../../../domain/entities/trip.entity';
import type { TripRepositoryPort } from '../../../domain/ports/trip.repository.port';
import { TRIP_REPOSITORY } from '../../../trips.di-tokens';
import { GetActiveTripForDriverQuery } from './get-active-trip-for-driver.query';

@Injectable()
export class GetActiveTripForDriverUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly trips: TripRepositoryPort,
  ) {}

  async execute(query: GetActiveTripForDriverQuery): Promise<Trip | null> {
    return this.trips.findActiveByDriver(query.driverId, query.tenantId);
  }
}
