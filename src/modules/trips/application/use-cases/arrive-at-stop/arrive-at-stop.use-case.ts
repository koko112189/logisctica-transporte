import { Inject, Injectable } from '@nestjs/common';
import { StopNotFoundError } from '../../../domain/errors/trip.errors';
import { TripNotFoundError } from '../../../domain/errors/trip.errors';
import type { TripRepositoryPort } from '../../../domain/ports/trip.repository.port';
import { TRIP_REPOSITORY } from '../../../trips.di-tokens';
import { ArriveAtStopCommand } from './arrive-at-stop.command';

@Injectable()
export class ArriveAtStopUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly trips: TripRepositoryPort,
  ) {}

  async execute(command: ArriveAtStopCommand): Promise<void> {
    const trip = await this.trips.findById(command.tripId, command.tenantId);
    if (!trip) throw new TripNotFoundError(command.tripId);
    const stop = trip.stops.find((s) => s.stopOrder === command.stopOrder);
    if (!stop) throw new StopNotFoundError(command.stopOrder);
    await this.trips.save(trip.arriveAtStop(command.stopOrder, new Date()));
  }
}
