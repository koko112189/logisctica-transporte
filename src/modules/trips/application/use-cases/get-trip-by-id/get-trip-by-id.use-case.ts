import { Inject, Injectable } from '@nestjs/common';
import type { Trip } from '../../../domain/entities/trip.entity';
import { TripNotFoundError } from '../../../domain/errors/trip.errors';
import type { TripRepositoryPort } from '../../../domain/ports/trip.repository.port';
import { TRIP_REPOSITORY } from '../../../trips.di-tokens';
import { GetTripByIdQuery } from './get-trip-by-id.query';

@Injectable()
export class GetTripByIdUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly trips: TripRepositoryPort,
  ) {}

  async execute(query: GetTripByIdQuery): Promise<Trip> {
    const trip = await this.trips.findById(query.tripId, query.tenantId);
    if (!trip) throw new TripNotFoundError(query.tripId);
    return trip;
  }
}
