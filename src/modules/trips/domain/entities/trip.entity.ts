import type { CoordinatesVO } from '../../../../shared/domain/value-objects/coordinates.vo';
import type { LocationVO } from '../../../../shared/domain/value-objects/location.vo';
import { StopStatus } from '../enums/stop-status.enum';
import { TripEvent } from '../enums/trip-event.enum';
import { TripStatus } from '../enums/trip-status.enum';
import type { VehicleCategory } from '../enums/vehicle-category.enum';
import { TripAuditEntry } from '../value-objects/trip-audit-entry.vo';
import { TripStop } from '../value-objects/trip-stop.vo';

export class Trip {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly vehicleId: string,
    public readonly driverId: string,
    public readonly appointmentId: string | null,
    public readonly vehicleCategory: VehicleCategory,
    public readonly isExternalCarrier: boolean,
    public readonly domiciliaryId: string | null,
    public readonly externalCarrierId: string | null,
    public readonly externalVehicleId: string | null,
    public readonly originWarehouseId: string | null,
    public readonly origin: LocationVO,
    public readonly destination: LocationVO,
    public readonly stops: TripStop[],
    public readonly startedAt: Date | null,
    public readonly estimatedArrival: Date | null,
    public readonly actualArrival: Date | null,
    public readonly currentLocation: CoordinatesVO | null,
    public readonly lastLocationUpdatedAt: Date | null,
    public readonly status: TripStatus,
    public readonly checklistComplied: boolean,
    public readonly auditLog: TripAuditEntry[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  private copy(overrides: Partial<{
    stops: TripStop[];
    startedAt: Date | null;
    estimatedArrival: Date | null;
    actualArrival: Date | null;
    currentLocation: CoordinatesVO | null;
    lastLocationUpdatedAt: Date | null;
    status: TripStatus;
    checklistComplied: boolean;
    auditLog: TripAuditEntry[];
    updatedAt: Date;
  }>): Trip {
    return new Trip(
      this.id, this.tenantId, this.vehicleId, this.driverId,
      this.appointmentId, this.vehicleCategory, this.isExternalCarrier,
      this.domiciliaryId, this.externalCarrierId, this.externalVehicleId, this.originWarehouseId,
      this.origin, this.destination,
      overrides.stops ?? this.stops,
      overrides.startedAt !== undefined ? overrides.startedAt : this.startedAt,
      overrides.estimatedArrival !== undefined ? overrides.estimatedArrival : this.estimatedArrival,
      overrides.actualArrival !== undefined ? overrides.actualArrival : this.actualArrival,
      overrides.currentLocation !== undefined ? overrides.currentLocation : this.currentLocation,
      overrides.lastLocationUpdatedAt !== undefined ? overrides.lastLocationUpdatedAt : this.lastLocationUpdatedAt,
      overrides.status ?? this.status,
      overrides.checklistComplied ?? this.checklistComplied,
      overrides.auditLog ?? this.auditLog,
      this.createdAt,
      overrides.updatedAt ?? new Date(),
    );
  }

  private addAudit(event: TripEvent, description: string, metadata?: Record<string, unknown>): TripAuditEntry[] {
    return [...this.auditLog, new TripAuditEntry(new Date(), event, description, metadata ?? null, null)];
  }

  start(now: Date): Trip {
    return this.copy({
      status: TripStatus.IN_TRANSIT,
      startedAt: now,
      checklistComplied: true,
      auditLog: [...this.auditLog,
        new TripAuditEntry(now, TripEvent.CHECKLIST_VERIFIED, 'Checklist del día verificado', null, null),
        new TripAuditEntry(now, TripEvent.STARTED, 'Viaje iniciado', null, null),
      ],
      updatedAt: now,
    });
  }

  updateLocation(coords: CoordinatesVO, now: Date): Trip {
    return this.copy({
      currentLocation: coords,
      lastLocationUpdatedAt: now,
      auditLog: this.addAudit(TripEvent.LOCATION_UPDATE, 'Ubicación actualizada', { lat: coords.lat, lng: coords.lng }),
      updatedAt: now,
    });
  }

  arriveAtStop(stopOrder: number, now: Date): Trip {
    const stops = this.stops.map((s) =>
      s.stopOrder === stopOrder
        ? new TripStop(s.stopOrder, s.pickupPointId, s.type, s.scheduledArrival, now, StopStatus.ARRIVED, s.notes, s.storeDeliveryId)
        : s,
    );
    return this.copy({
      stops,
      auditLog: this.addAudit(TripEvent.STOP_ARRIVED, `Llegada a parada ${stopOrder}`, { stopOrder }),
      updatedAt: now,
    });
  }

  completeStop(stopOrder: number, now: Date): Trip {
    const stops = this.stops.map((s) =>
      s.stopOrder === stopOrder
        ? new TripStop(s.stopOrder, s.pickupPointId, s.type, s.scheduledArrival, s.actualArrival ?? now, StopStatus.COMPLETED, s.notes, s.storeDeliveryId)
        : s,
    );
    return this.copy({
      stops,
      auditLog: this.addAudit(TripEvent.STOP_COMPLETED, `Parada ${stopOrder} completada`, { stopOrder }),
      updatedAt: now,
    });
  }

  reportDelay(reason: string, newETA: Date, now: Date): Trip {
    return this.copy({
      status: TripStatus.DELAYED,
      estimatedArrival: newETA,
      auditLog: this.addAudit(TripEvent.DELAY_REPORTED, `Retraso reportado: ${reason}`, { reason, newETA }),
      updatedAt: now,
    });
  }

  complete(now: Date): Trip {
    return this.copy({
      status: TripStatus.COMPLETED,
      actualArrival: now,
      auditLog: this.addAudit(TripEvent.COMPLETED, 'Viaje completado'),
      updatedAt: now,
    });
  }

  cancel(reason: string, now: Date): Trip {
    return this.copy({
      status: TripStatus.CANCELLED,
      auditLog: this.addAudit(TripEvent.CANCELLED, `Viaje cancelado: ${reason}`, { reason }),
      updatedAt: now,
    });
  }
}
