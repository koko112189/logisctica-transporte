import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'node:crypto';
import { CalypsoEvents } from '../../../../../shared/events/calypso-events';
import { CoordinatesVO } from '../../../../../shared/domain/value-objects/coordinates.vo';
import { LocationVO } from '../../../../../shared/domain/value-objects/location.vo';
import { Trip } from '../../../domain/entities/trip.entity';
import { TripEvent } from '../../../domain/enums/trip-event.enum';
import { TripStatus } from '../../../domain/enums/trip-status.enum';
import { StopStatus } from '../../../domain/enums/stop-status.enum';
import type { TripRepositoryPort } from '../../../domain/ports/trip.repository.port';
import { TripAuditEntry } from '../../../domain/value-objects/trip-audit-entry.vo';
import { TripStop } from '../../../domain/value-objects/trip-stop.vo';
import { TRIP_REPOSITORY } from '../../../trips.di-tokens';
import { CreateTripCommand } from './create-trip.command';

@Injectable()
export class CreateTripUseCase {
  constructor(
    @Inject(TRIP_REPOSITORY)
    private readonly trips: TripRepositoryPort,
    private readonly events: EventEmitter2,
  ) {}

  async execute(command: CreateTripCommand): Promise<{ tripId: string }> {
    const now = new Date();
    const toCoords = (lat: number | null, lng: number | null) =>
      lat != null && lng != null ? new CoordinatesVO(lat, lng) : null;

    const stops = command.stops.map(
      (s) =>
        new TripStop(
          s.stopOrder,
          s.pickupPointId,
          s.type,
          s.scheduledArrival ? new Date(s.scheduledArrival) : null,
          null,
          StopStatus.PENDING,
          s.notes ?? null,
          null,
        ),
    );

    const trip = new Trip(
      randomUUID(),
      command.tenantId,
      command.vehicleId,
      command.driverId,
      command.appointmentId,
      command.vehicleCategory,
      command.isExternalCarrier,
      command.domiciliaryId,
      command.externalCarrierId,
      command.externalVehicleId,
      command.originWarehouseId,
      new LocationVO(command.originAddress, command.originCity, toCoords(command.originLat, command.originLng)),
      new LocationVO(command.destinationAddress, command.destinationCity, toCoords(command.destinationLat, command.destinationLng)),
      stops,
      null,
      command.estimatedArrival,
      null,
      null,
      null,
      TripStatus.PENDING,
      false,
      [new TripAuditEntry(now, TripEvent.CREATED, 'Viaje creado', null, null)],
      now,
      now,
    );
    await this.trips.save(trip);
    this.events.emit(CalypsoEvents.TRIP_CREATED, {
      tenantId: command.tenantId,
      tripId: trip.id,
      performedByUserId: command.performedByUserId,
      vehicleId: command.vehicleId,
      driverId: command.driverId,
      isExternalCarrier: command.isExternalCarrier,
      originWarehouseId: command.originWarehouseId,
    });
    return { tripId: trip.id };
  }
}
