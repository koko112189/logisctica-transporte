import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class AppointmentNotFoundError extends DomainError {
  readonly code = 'APPOINTMENT_NOT_FOUND';
  constructor(id: string) {
    super(`Cita no encontrada: ${id}`);
  }
}

export class AppointmentCancelledError extends DomainError {
  readonly code = 'APPOINTMENT_CANCELLED';
  constructor() {
    super('No se puede operar sobre una cita cancelada');
  }
}

export class VehicleUnavailableError extends DomainError {
  readonly code = 'VEHICLE_UNAVAILABLE';
  constructor(vehicleId: string) {
    super(`El vehículo ${vehicleId} no está disponible para asignación`);
  }
}
