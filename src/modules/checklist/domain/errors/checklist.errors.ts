import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class ChecklistNotFoundError extends DomainError {
  readonly code = 'CHECKLIST_NOT_FOUND';
  constructor(id: string) {
    super(`Checklist no encontrado: ${id}`);
  }
}

export class ChecklistAlreadySubmittedError extends DomainError {
  readonly code = 'CHECKLIST_ALREADY_SUBMITTED';
  constructor() {
    super('El checklist ya fue enviado');
  }
}

export class ChecklistAlreadyExistsError extends DomainError {
  readonly code = 'CHECKLIST_ALREADY_EXISTS';
  constructor(vehicleId: string, date: string) {
    super(`Ya existe un checklist para el vehículo ${vehicleId} en la fecha ${date}`);
  }
}

export class VehicleHasNoDriverError extends DomainError {
  readonly code = 'VEHICLE_HAS_NO_DRIVER';
  constructor(vehicleId: string) {
    super(`El vehículo ${vehicleId} no tiene conductor asignado`);
  }
}
