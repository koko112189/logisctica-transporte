import type { AppointmentStatus } from '../../../domain/enums/appointment-status.enum';

export class ListAppointmentsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly vehicleId?: string,
    public readonly driverId?: string,
    public readonly status?: AppointmentStatus,
    public readonly from?: Date,
    public readonly to?: Date,
  ) {}
}
