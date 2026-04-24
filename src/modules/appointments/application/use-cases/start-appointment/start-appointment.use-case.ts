import { Inject, Injectable } from '@nestjs/common';
import {
  AppointmentCancelledError,
  AppointmentNotFoundError,
} from '../../../domain/errors/appointment.errors';
import { AppointmentStatus } from '../../../domain/enums/appointment-status.enum';
import type { AppointmentRepositoryPort } from '../../../domain/ports/appointment.repository.port';
import { APPOINTMENT_REPOSITORY } from '../../../appointments.di-tokens';
import { StartAppointmentCommand } from './start-appointment.command';

@Injectable()
export class StartAppointmentUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointments: AppointmentRepositoryPort,
  ) {}

  async execute(command: StartAppointmentCommand): Promise<void> {
    const appt = await this.appointments.findById(command.appointmentId, command.tenantId);
    if (!appt) throw new AppointmentNotFoundError(command.appointmentId);
    if (appt.status === AppointmentStatus.CANCELLED) throw new AppointmentCancelledError();
    await this.appointments.save(appt.start());
  }
}
