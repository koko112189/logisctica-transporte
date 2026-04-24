import type { Appointment } from '../../../domain/entities/appointment.entity';

export class ListAppointmentsResult {
  constructor(
    public readonly items: Appointment[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
