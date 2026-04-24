import { Inject, Injectable } from '@nestjs/common';
import { CoordinatesVO } from '../../../../../shared/domain/value-objects/coordinates.vo';
import { TripNotFoundError } from '../../../domain/errors/trip.errors';
import type { TripRepositoryPort } from '../../../domain/ports/trip.repository.port';
import { TRIP_REPOSITORY } from '../../../trips.di-tokens';
import { UpdateTripLocationCommand } from './update-trip-location.command';

@Injectable()
export class UpdateTripLocationUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly trips: TripRepositoryPort,
  ) {}

  async execute(command: UpdateTripLocationCommand): Promise<void> {
    const trip = await this.trips.findById(command.tripId, command.tenantId);
    if (!trip) throw new TripNotFoundError(command.tripId);
    await this.trips.save(trip.updateLocation(new CoordinatesVO(command.lat, command.lng), new Date()));
  }
}
