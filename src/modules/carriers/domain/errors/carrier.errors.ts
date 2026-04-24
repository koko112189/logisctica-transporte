import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class ExternalTaxIdExistsError extends DomainError {
  readonly code = 'EXTERNAL_CARRIER_TAX_DUPLICATE';
  constructor(taxId: string) {
    super(`Ya existe un portador con NIT/ID: ${taxId}`);
  }
}

export class ExternalVehiclePlateExistsError extends DomainError {
  readonly code = 'EXTERNAL_VEHICLE_PLATE_DUPLICATE';
  constructor(plate: string) {
    super(`Ya existe un vehículo externo con placa: ${plate}`);
  }
}

export class ExternalCarrierNotFoundError extends DomainError {
  readonly code = 'EXTERNAL_CARRIER_NOT_FOUND';
  constructor() {
    super('Portador externo no encontrado');
  }
}
