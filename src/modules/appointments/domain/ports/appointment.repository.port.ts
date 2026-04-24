import type { AppointmentStatus } from '../enums/appointment-status.enum';
import type { Appointment } from '../entities/appointment.entity';

export interface AppointmentFilters {
  vehicleId?: string;
  driverId?: string;
  status?: AppointmentStatus;
  from?: Date;
  to?: Date;
}

export interface AppointmentRepositoryPort {
  save(appointment: Appointment): Promise<void>;
  findById(id: string, tenantId: string): Promise<Appointment | null>;
  list(
    tenantId: string,
    filters: AppointmentFilters,
    skip: number,
    limit: number,
  ): Promise<{ items: Appointment[]; total: number }>;
  findUpcomingByDriver(
    driverId: string,
    tenantId: string,
    from: Date,
  ): Promise<Appointment[]>;
}
