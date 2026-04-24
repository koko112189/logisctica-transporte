import { Inject, Injectable } from '@nestjs/common';
import { TripNotFoundError } from '../../../domain/errors/trip.errors';
import type { TripRepositoryPort } from '../../../domain/ports/trip.repository.port';
import { TRIP_REPOSITORY } from '../../../trips.di-tokens';
import { CancelTripCommand } from './cancel-trip.command';

@Injectable()
export class CancelTripUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly trips: TripRepositoryPort,
  ) {}

  async execute(command: CancelTripCommand): Promise<void> {
    const trip = await this.trips.findById(command.tripId, command.tenantId);
    if (!trip) throw new TripNotFoundError(command.tripId);
    await this.trips.save(trip.cancel(command.reason, new Date()));
  }
}
