import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CoordinatesVO } from '../../../../../shared/domain/value-objects/coordinates.vo';
import { LocationVO } from '../../../../../shared/domain/value-objects/location.vo';
import type { INotificationService } from '../../../../../shared/domain/ports/notification.service.port';
import { NOTIFICATION_SERVICE } from '../../../../../shared/domain/ports/notification.service.port';
import { GetUserByIdUseCase } from '../../../../users/application/use-cases/get-user-by-id/get-user-by-id.use-case';
import { GetUserByIdQuery } from '../../../../users/application/use-cases/get-user-by-id/get-user-by-id.query';
import { GetVehicleByIdUseCase } from '../../../../vehicles/application/use-cases/get-vehicle-by-id/get-vehicle-by-id.use-case';
import { GetVehicleByIdQuery } from '../../../../vehicles/application/use-cases/get-vehicle-by-id/get-vehicle-by-id.query';
import { VehicleStatus } from '../../../../vehicles/domain/enums/vehicle-status.enum';
import { Appointment } from '../../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../../domain/enums/appointment-status.enum';
import { VehicleUnavailableError } from '../../../domain/errors/appointment.errors';
import type { AppointmentRepositoryPort } from '../../../domain/ports/appointment.repository.port';
import { APPOINTMENT_REPOSITORY } from '../../../appointments.di-tokens';
import { CreateAppointmentCommand } from './create-appointment.command';
import { CreateAppointmentResult } from './create-appointment.result';

@Injectable()
export class CreateAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointments: AppointmentRepositoryPort,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notifications: INotificationService,
    private readonly getVehicle: GetVehicleByIdUseCase,
    private readonly getUserById: GetUserByIdUseCase,
  ) {}

  async execute(
    command: CreateAppointmentCommand,
  ): Promise<CreateAppointmentResult> {
    const vehicle = await this.getVehicle.execute(
      new GetVehicleByIdQuery(command.vehicleId, command.tenantId),
    );
    if (vehicle.status !== VehicleStatus.ACTIVE) {
      throw new VehicleUnavailableError(command.vehicleId);
    }

    const toLocation = (i: CreateAppointmentCommand['origin']): LocationVO =>
      new LocationVO(
        i.address,
        i.city,
        i.lat != null && i.lng != null
          ? new CoordinatesVO(i.lat, i.lng)
          : null,
      );

    const now = new Date();
    const appointment = new Appointment(
      randomUUID(),
      command.tenantId,
      command.vehicleId,
      command.driverId,
      command.title,
      command.description,
      toLocation(command.origin),
      toLocation(command.destination),
      command.scheduledAt,
      command.estimatedDurationMinutes,
      AppointmentStatus.SCHEDULED,
      null,
      now,
      now,
    );
    await this.appointments.save(appointment);

    // Notificar al conductor
    try {
      const driver = await this.getUserById.execute(
        new GetUserByIdQuery(command.driverId),
      );
      const scheduled = command.scheduledAt.toLocaleString('es-CO', {
        timeZone: 'America/Bogota',
        dateStyle: 'full',
        timeStyle: 'short',
      });
      await this.notifications.sendEmail({
        to: driver.email,
        subject: `Nueva ruta asignada: ${command.title}`,
        body: `
          <p>Hola, tienes una nueva ruta asignada.</p>
          <p><strong>Ruta:</strong> ${command.title}</p>
          <p><strong>Origen:</strong> ${command.origin.address}, ${command.origin.city}</p>
          <p><strong>Destino:</strong> ${command.destination.address}, ${command.destination.city}</p>
          <p><strong>Fecha programada:</strong> ${scheduled}</p>
          <p><strong>Duración estimada:</strong> ${command.estimatedDurationMinutes} minutos</p>
        `,
      });
      await this.appointments.save(appointment.markNotified());
    } catch {
      // La notificación falla silenciosamente para no bloquear la creación
    }

    return new CreateAppointmentResult(appointment.id);
  }
}
