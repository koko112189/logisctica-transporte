import { Inject, Injectable } from '@nestjs/common';
import type { Appointment } from '../../../domain/entities/appointment.entity';
import { AppointmentNotFoundError } from '../../../domain/errors/appointment.errors';
import type { AppointmentRepositoryPort } from '../../../domain/ports/appointment.repository.port';
import { APPOINTMENT_REPOSITORY } from '../../../appointments.di-tokens';
import { GetAppointmentByIdQuery } from './get-appointment-by-id.query';

@Injectable()
export class GetAppointmentByIdUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointments: AppointmentRepositoryPort,
  ) {}

  async execute(query: GetAppointmentByIdQuery): Promise<Appointment> {
    const appt = await this.appointments.findById(query.appointmentId, query.tenantId);
    if (!appt) throw new AppointmentNotFoundError(query.appointmentId);
    return appt;
  }
}
