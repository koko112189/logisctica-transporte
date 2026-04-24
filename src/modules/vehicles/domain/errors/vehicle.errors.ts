import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class VehicleNotFoundError extends DomainError {
  readonly code = 'VEHICLE_NOT_FOUND';
  constructor(id: string) {
    super(`Vehículo no encontrado: ${id}`);
  }
}

export class VehiclePlateAlreadyExistsError extends DomainError {
  readonly code = 'VEHICLE_PLATE_DUPLICATE';
  constructor(plate: string) {
    super(`Ya existe un vehículo con la matrícula: ${plate}`);
  }
}

export class DefectNotFoundError extends DomainError {
  readonly code = 'DEFECT_NOT_FOUND';
  constructor(defectId: string) {
    super(`Defecto no encontrado: ${defectId}`);
  }
}
