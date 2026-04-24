import { Inject, Injectable } from '@nestjs/common';
import type { Trip } from '../../../domain/entities/trip.entity';
import type { TripRepositoryPort } from '../../../domain/ports/trip.repository.port';
import { TRIP_REPOSITORY } from '../../../trips.di-tokens';
import { ListTripsQuery } from './list-trips.query';

@Injectable()
export class ListTripsUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly trips: TripRepositoryPort,
  ) {}

  async execute(query: ListTripsQuery): Promise<{ items: Trip[]; total: number }> {
    return this.trips.findAll(
      query.tenantId,
      {
        vehicleId: query.vehicleId,
        driverId: query.driverId,
        status: query.status,
        vehicleCategory: query.vehicleCategory,
        isExternalCarrier: query.isExternalCarrier,
        from: query.from,
        to: query.to,
      },
      query.page,
      query.limit,
    );
  }
}
