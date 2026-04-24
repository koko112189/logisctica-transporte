import type { LocationVO } from '../../../../shared/domain/value-objects/location.vo';
import { AppointmentStatus } from '../enums/appointment-status.enum';

export class Appointment {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly vehicleId: string,
    public readonly driverId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly origin: LocationVO,
    public readonly destination: LocationVO,
    public readonly scheduledAt: Date,
    public readonly estimatedDurationMinutes: number,
    public readonly status: AppointmentStatus,
    public readonly notificationSentAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  cancel(): Appointment {
    return new Appointment(
      this.id, this.tenantId, this.vehicleId, this.driverId,
      this.title, this.description, this.origin, this.destination,
      this.scheduledAt, this.estimatedDurationMinutes,
      AppointmentStatus.CANCELLED, this.notificationSentAt,
      this.createdAt, new Date(),
    );
  }

  start(): Appointment {
    return new Appointment(
      this.id, this.tenantId, this.vehicleId, this.driverId,
      this.title, this.description, this.origin, this.destination,
      this.scheduledAt, this.estimatedDurationMinutes,
      AppointmentStatus.IN_PROGRESS, this.notificationSentAt,
      this.createdAt, new Date(),
    );
  }

  complete(): Appointment {
    return new Appointment(
      this.id, this.tenantId, this.vehicleId, this.driverId,
      this.title, this.description, this.origin, this.destination,
      this.scheduledAt, this.estimatedDurationMinutes,
      AppointmentStatus.COMPLETED, this.notificationSentAt,
      this.createdAt, new Date(),
    );
  }

  markNotified(): Appointment {
    return new Appointment(
      this.id, this.tenantId, this.vehicleId, this.driverId,
      this.title, this.description, this.origin, this.destination,
      this.scheduledAt, this.estimatedDurationMinutes,
      this.status, new Date(),
      this.createdAt, new Date(),
    );
  }
}
