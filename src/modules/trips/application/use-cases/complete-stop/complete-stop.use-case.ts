import { Inject, Injectable } from '@nestjs/common';
import { StopAlreadyCompletedError, StopNotFoundError, TripNotFoundError } from '../../../domain/errors/trip.errors';
import { StopStatus } from '../../../domain/enums/stop-status.enum';
import type { TripRepositoryPort } from '../../../domain/ports/trip.repository.port';
import { TRIP_REPOSITORY } from '../../../trips.di-tokens';
import { CompleteStopCommand } from './complete-stop.command';

@Injectable()
export class CompleteStopUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly trips: TripRepositoryPort,
  ) {}

  async execute(command: CompleteStopCommand): Promise<void> {
    const trip = await this.trips.findById(command.tripId, command.tenantId);
    if (!trip) throw new TripNotFoundError(command.tripId);
    const stop = trip.stops.find((s) => s.stopOrder === command.stopOrder);
    if (!stop) throw new StopNotFoundError(command.stopOrder);
    if (stop.status === StopStatus.COMPLETED) throw new StopAlreadyCompletedError(command.stopOrder);
    await this.trips.save(trip.completeStop(command.stopOrder, new Date()));
  }
}
