import { Inject, Injectable } from '@nestjs/common';
import { GetPickupPointByIdQuery } from '../../../../route-points/application/use-cases/get-pickup-point-by-id/get-pickup-point-by-id.query';
import { GetPickupPointByIdUseCase } from '../../../../route-points/application/use-cases/get-pickup-point-by-id/get-pickup-point-by-id.use-case';
import type { PickupPoint } from '../../../../route-points/domain/entities/pickup-point.entity';
import type { Trip } from '../../../domain/entities/trip.entity';
import { TripNotFoundError } from '../../../domain/errors/trip.errors';
import type { TripRepositoryPort } from '../../../domain/ports/trip.repository.port';
import type { TripStop } from '../../../domain/value-objects/trip-stop.vo';
import { TRIP_REPOSITORY } from '../../../trips.di-tokens';
import { GetTripRouteQuery } from './get-trip-route.query';

export interface TripRouteStop {
  stopOrder: number;
  pickupPoint: PickupPoint | null;
  type: TripStop['type'];
  scheduledArrival: Date | null;
  actualArrival: Date | null;
  status: TripStop['status'];
  notes: string | null;
}

export interface TripRoute {
  trip: Trip;
  stops: TripRouteStop[];
}

@Injectable()
export class GetTripRouteUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly trips: TripRepositoryPort,
    private readonly getPickupPoint: GetPickupPointByIdUseCase,
  ) {}

  async execute(query: GetTripRouteQuery): Promise<TripRoute> {
    const trip = await this.trips.findById(query.tripId, query.tenantId);
    if (!trip) throw new TripNotFoundError(query.tripId);

    const sorted = [...trip.stops].sort((a, b) => a.stopOrder - b.stopOrder);

    const stops: TripRouteStop[] = await Promise.all(
      sorted.map(async (s) => {
        let pickupPoint: PickupPoint | null = null;
        try {
          pickupPoint = await this.getPickupPoint.execute(
            new GetPickupPointByIdQuery(s.pickupPointId, query.tenantId),
          );
        } catch {
          // pickupPoint remains null if not found
        }
        return {
          stopOrder: s.stopOrder,
          pickupPoint,
          type: s.type,
          scheduledArrival: s.scheduledArrival,
          actualArrival: s.actualArrival,
          status: s.status,
          notes: s.notes,
        };
      }),
    );

    return { trip, stops };
  }
}
