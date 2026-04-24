import type { LocationInput } from '../create-appointment/create-appointment.command';

export class UpdateAppointmentCommand {
  constructor(
    public readonly appointmentId: string,
    public readonly tenantId: string,
    public readonly title?: string,
    public readonly description?: string,
    public readonly origin?: LocationInput,
    public readonly destination?: LocationInput,
    public readonly scheduledAt?: Date,
    public readonly estimatedDurationMinutes?: number,
  ) {}
}
