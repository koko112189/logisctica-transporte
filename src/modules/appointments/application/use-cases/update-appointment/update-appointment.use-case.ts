import { Inject, Injectable } from '@nestjs/common';
import { CoordinatesVO } from '../../../../../shared/domain/value-objects/coordinates.vo';
import { LocationVO } from '../../../../../shared/domain/value-objects/location.vo';
import type { INotificationService } from '../../../../../shared/domain/ports/notification.service.port';
import { NOTIFICATION_SERVICE } from '../../../../../shared/domain/ports/notification.service.port';
import { GetUserByIdUseCase } from '../../../../users/application/use-cases/get-user-by-id/get-user-by-id.use-case';
import { GetUserByIdQuery } from '../../../../users/application/use-cases/get-user-by-id/get-user-by-id.query';
import { Appointment } from '../../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../../domain/enums/appointment-status.enum';
import {
  AppointmentCancelledError,
  AppointmentNotFoundError,
} from '../../../domain/errors/appointment.errors';
import type { AppointmentRepositoryPort } from '../../../domain/ports/appointment.repository.port';
import { APPOINTMENT_REPOSITORY } from '../../../appointments.di-tokens';
import type { LocationInput } from '../create-appointment/create-appointment.command';
import { UpdateAppointmentCommand } from './update-appointment.command';

@Injectable()
export class UpdateAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointments: AppointmentRepositoryPort,
    @Inject(NOTIFICATION_SERVICE)
    private readonly notifications: INotificationService,
    private readonly getUserById: GetUserByIdUseCase,
  ) {}

  async execute(command: UpdateAppointmentCommand): Promise<void> {
    const appt = await this.appointments.findById(
      command.appointmentId,
      command.tenantId,
    );
    if (!appt) throw new AppointmentNotFoundError(command.appointmentId);
    if (appt.status === AppointmentStatus.CANCELLED) {
      throw new AppointmentCancelledError();
    }

    const toLocation = (i: LocationInput): LocationVO =>
      new LocationVO(
        i.address,
        i.city,
        i.lat != null && i.lng != null ? new CoordinatesVO(i.lat, i.lng) : null,
      );

    const rescheduled =
      command.scheduledAt !== undefined &&
      command.scheduledAt.getTime() !== appt.scheduledAt.getTime();

    const updated = new Appointment(
      appt.id, appt.tenantId, appt.vehicleId, appt.driverId,
      command.title ?? appt.title,
      command.description ?? appt.description,
      command.origin ? toLocation(command.origin) : appt.origin,
      command.destination ? toLocation(command.destination) : appt.destination,
      command.scheduledAt ?? appt.scheduledAt,
      command.estimatedDurationMinutes ?? appt.estimatedDurationMinutes,
      appt.status, appt.notificationSentAt,
      appt.createdAt, new Date(),
    );
    await this.appointments.save(updated);

    if (rescheduled) {
      try {
        const driver = await this.getUserById.execute(
          new GetUserByIdQuery(appt.driverId),
        );
        await this.notifications.sendEmail({
          to: driver.email,
          subject: `Ruta reprogramada: ${updated.title}`,
          body: `<p>Tu ruta <strong>${updated.title}</strong> ha sido reprogramada para: ${command.scheduledAt!.toLocaleString('es-CO', { timeZone: 'America/Bogota' })}</p>`,
        });
        await this.appointments.save(updated.markNotified());
      } catch {
        // Notificación silenciosa
      }
    }
  }
}
