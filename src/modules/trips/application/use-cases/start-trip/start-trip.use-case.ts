import { Inject, Injectable } from '@nestjs/common';
import { DomainError } from '../../../../../shared/domain/errors/domain.error';
import { GetChecklistByVehicleAndDateUseCase } from '../../../../checklist/application/use-cases/get-checklist-by-vehicle-and-date/get-checklist-by-vehicle-and-date.use-case';
import { GetChecklistByVehicleAndDateQuery } from '../../../../checklist/application/use-cases/get-checklist-by-vehicle-and-date/get-checklist-by-vehicle-and-date.query';
import { ChecklistStatus } from '../../../../checklist/domain/enums/checklist-status.enum';
import {
  TripAlreadyStartedError,
  TripChecklistMissingError,
  TripNotFoundError,
} from '../../../domain/errors/trip.errors';
import { TripStatus } from '../../../domain/enums/trip-status.enum';
import type { TripRepositoryPort } from '../../../domain/ports/trip.repository.port';
import { TRIP_REPOSITORY } from '../../../trips.di-tokens';
import { StartTripCommand } from './start-trip.command';

@Injectable()
export class StartTripUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly trips: TripRepositoryPort,
    private readonly getChecklistByVehicleAndDate: GetChecklistByVehicleAndDateUseCase,
  ) {}

  async execute(command: StartTripCommand): Promise<void> {
    const trip = await this.trips.findById(command.tripId, command.tenantId);
    if (!trip) throw new TripNotFoundError(command.tripId);
    if (trip.status !== TripStatus.PENDING) throw new TripAlreadyStartedError();

    const today = new Date().toISOString().split('T')[0];
    let checklistOk = false;
    try {
      const cl = await this.getChecklistByVehicleAndDate.execute(
        new GetChecklistByVehicleAndDateQuery(trip.vehicleId, trip.tenantId, today),
      );
      checklistOk = cl.status === ChecklistStatus.COMPLETED;
    } catch (err) {
      if (err instanceof DomainError && err.code === 'CHECKLIST_NOT_FOUND') {
        checklistOk = false;
      } else {
        throw err;
      }
    }
    if (!checklistOk) throw new TripChecklistMissingError();

    const now = new Date();
    await this.trips.save(trip.start(now));
  }
}
