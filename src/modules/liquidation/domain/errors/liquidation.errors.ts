import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class StoreDeliveryNotFoundError extends DomainError {
  readonly code = 'STORE_DELIVERY_NOT_FOUND';
  constructor(id: string) {
    super(`Entrega ${id} no encontrada`);
  }
}

export class LiquidationNotFoundError extends DomainError {
  readonly code = 'LIQUIDATION_NOT_FOUND';
  constructor(id: string) {
    super(`Liquidación ${id} no encontrada`);
  }
}

export class LiquidationAlreadyExistsError extends DomainError {
  readonly code = 'LIQUIDATION_ALREADY_EXISTS';
  constructor(tripId: string) {
    super(`Ya existe una liquidación para el viaje ${tripId}`);
  }
}

export class CreditNoteNotFoundError extends DomainError {
  readonly code = 'CREDIT_NOTE_NOT_FOUND';
  constructor(id: string) {
    super(`Nota de crédito ${id} no encontrada`);
  }
}
