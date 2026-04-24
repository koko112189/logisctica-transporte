import { Inject, Injectable } from '@nestjs/common';
import type { AppointmentRepositoryPort } from '../../../domain/ports/appointment.repository.port';
import { APPOINTMENT_REPOSITORY } from '../../../appointments.di-tokens';
import { ListAppointmentsQuery } from './list-appointments.query';
import { ListAppointmentsResult } from './list-appointments.result';

@Injectable()
export class ListAppointmentsUseCase {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointments: AppointmentRepositoryPort,
  ) {}

  async execute(query: ListAppointmentsQuery): Promise<ListAppointmentsResult> {
    const skip = (query.page - 1) * query.limit;
    const { items, total } = await this.appointments.list(
      query.tenantId,
      {
        vehicleId: query.vehicleId,
        driverId: query.driverId,
        status: query.status,
        from: query.from,
        to: query.to,
      },
      skip,
      query.limit,
    );
    return new ListAppointmentsResult(items, total, query.page, query.limit);
  }
}
