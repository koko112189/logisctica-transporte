import { Injectable } from '@nestjs/common';
import type { Trip } from '../../domain/entities/trip.entity';
import { CreateTripCommand } from '../../application/use-cases/create-trip/create-trip.command';
import type { CreateTripRequestDto } from './dto/create-trip.request.dto';
import type { TripResponseDto } from './dto/trip.response.dto';

@Injectable()
export class TripsHttpMapper {
  toCreateCommand(
    tenantId: string,
    dto: CreateTripRequestDto,
    performedByUserId: string | null,
  ): CreateTripCommand {
    return new CreateTripCommand(
      tenantId,
      dto.vehicleId,
      dto.driverId,
      dto.vehicleCategory,
      dto.originAddress,
      dto.originCity,
      dto.originLat ?? null,
      dto.originLng ?? null,
      dto.destinationAddress,
      dto.destinationCity,
      dto.destinationLat ?? null,
      dto.destinationLng ?? null,
      dto.stops,
      dto.appointmentId ?? null,
      dto.isExternalCarrier ?? false,
      dto.domiciliaryId ?? null,
      (dto.isExternalCarrier ? dto.externalCarrierId : null) ?? null,
      (dto.isExternalCarrier ? dto.externalVehicleId : null) ?? null,
      dto.originWarehouseId ?? null,
      dto.estimatedArrival ? new Date(dto.estimatedArrival) : null,
      performedByUserId,
    );
  }

  toResponse(trip: Trip): TripResponseDto {
    return {
      id: trip.id,
      tenantId: trip.tenantId,
      vehicleId: trip.vehicleId,
      driverId: trip.driverId,
      appointmentId: trip.appointmentId,
      vehicleCategory: trip.vehicleCategory,
      isExternalCarrier: trip.isExternalCarrier,
      domiciliaryId: trip.domiciliaryId,
      externalCarrierId: trip.externalCarrierId,
      externalVehicleId: trip.externalVehicleId,
      originWarehouseId: trip.originWarehouseId,
      origin: {
        address: trip.origin.address,
        city: trip.origin.city,
        lat: trip.origin.coordinates?.lat ?? null,
        lng: trip.origin.coordinates?.lng ?? null,
      },
      destination: {
        address: trip.destination.address,
        city: trip.destination.city,
        lat: trip.destination.coordinates?.lat ?? null,
        lng: trip.destination.coordinates?.lng ?? null,
      },
      stops: trip.stops.map((s) => ({
        stopOrder: s.stopOrder,
        pickupPointId: s.pickupPointId,
        type: s.type,
        scheduledArrival: s.scheduledArrival?.toISOString() ?? null,
        actualArrival: s.actualArrival?.toISOString() ?? null,
        status: s.status,
        notes: s.notes,
      })),
      startedAt: trip.startedAt?.toISOString() ?? null,
      estimatedArrival: trip.estimatedArrival?.toISOString() ?? null,
      actualArrival: trip.actualArrival?.toISOString() ?? null,
      currentLat: trip.currentLocation?.lat ?? null,
      currentLng: trip.currentLocation?.lng ?? null,
      status: trip.status,
      checklistComplied: trip.checklistComplied,
      auditLog: trip.auditLog.map((e) => ({
        timestamp: e.timestamp.toISOString(),
        event: e.event,
        description: e.description,
      })),
      createdAt: trip.createdAt.toISOString(),
      updatedAt: trip.updatedAt.toISOString(),
    };
  }
}
