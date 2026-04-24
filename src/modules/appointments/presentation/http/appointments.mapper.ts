import { Injectable } from '@nestjs/common';
import type { Appointment } from '../../domain/entities/appointment.entity';
import { CreateAppointmentCommand } from '../../application/use-cases/create-appointment/create-appointment.command';
import { UpdateAppointmentCommand } from '../../application/use-cases/update-appointment/update-appointment.command';
import type { CreateAppointmentRequestDto } from './dto/create-appointment.request.dto';
import type { UpdateAppointmentRequestDto } from './dto/update-appointment.request.dto';
import type { AppointmentResponseDto, LocationResponseDto } from './dto/appointment.response.dto';

@Injectable()
export class AppointmentsHttpMapper {
  toCreateCommand(tenantId: string, dto: CreateAppointmentRequestDto): CreateAppointmentCommand {
    return new CreateAppointmentCommand(
      tenantId, dto.vehicleId, dto.driverId,
      dto.title, dto.description ?? '',
      { address: dto.origin.address, city: dto.origin.city, lat: dto.origin.lat, lng: dto.origin.lng },
      { address: dto.destination.address, city: dto.destination.city, lat: dto.destination.lat, lng: dto.destination.lng },
      new Date(dto.scheduledAt),
      dto.estimatedDurationMinutes,
    );
  }

  toUpdateCommand(apptId: string, tenantId: string, dto: UpdateAppointmentRequestDto): UpdateAppointmentCommand {
    return new UpdateAppointmentCommand(
      apptId, tenantId,
      dto.title, dto.description,
      dto.origin ? { address: dto.origin.address!, city: dto.origin.city!, lat: dto.origin.lat, lng: dto.origin.lng } : undefined,
      dto.destination ? { address: dto.destination.address!, city: dto.destination.city!, lat: dto.destination.lat, lng: dto.destination.lng } : undefined,
      dto.scheduledAt ? new Date(dto.scheduledAt) : undefined,
      dto.estimatedDurationMinutes,
    );
  }

  toResponse(appt: Appointment): AppointmentResponseDto {
    const toLocDto = (l: Appointment['origin']): LocationResponseDto => ({
      address: l.address,
      city: l.city,
      lat: l.coordinates?.lat ?? null,
      lng: l.coordinates?.lng ?? null,
    });
    return {
      id: appt.id, tenantId: appt.tenantId,
      vehicleId: appt.vehicleId, driverId: appt.driverId,
      title: appt.title, description: appt.description,
      origin: toLocDto(appt.origin),
      destination: toLocDto(appt.destination),
      scheduledAt: appt.scheduledAt.toISOString(),
      estimatedDurationMinutes: appt.estimatedDurationMinutes,
      status: appt.status,
      notificationSentAt: appt.notificationSentAt ? appt.notificationSentAt.toISOString() : null,
      createdAt: appt.createdAt.toISOString(),
      updatedAt: appt.updatedAt.toISOString(),
    };
  }
}
