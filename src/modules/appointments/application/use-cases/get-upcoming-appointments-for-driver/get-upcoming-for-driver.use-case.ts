import { Inject, Injectable } from '@nestjs/common';
import type { Appointment } from '../../../domain/entities/appointment.entity';
import type { AppointmentRepositoryPort } from '../../../domain/ports/appointment.repository.port';
import { APPOINTMENT_REPOSITORY } from '../../../appointments.di-tokens';
import { GetUpcomingForDriverQuery } from './get-upcoming-for-driver.query';

@Injectable()
export class GetUpcomingForDriverUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointments: AppointmentRepositoryPort,
  ) {}

  async execute(query: GetUpcomingForDriverQuery): Promise<Appointment[]> {
    return this.appointments.findUpcomingByDriver(
      query.driverId,
      query.tenantId,
      new Date(),
    );
  }
}
