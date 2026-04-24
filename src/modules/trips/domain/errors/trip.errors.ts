import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class TripNotFoundError extends DomainError {
  readonly code = 'TRIP_NOT_FOUND';
  constructor(id: string) {
    super(`Viaje ${id} no encontrado`);
  }
}

export class TripAlreadyStartedError extends DomainError {
  readonly code = 'TRIP_ALREADY_STARTED';
  constructor() {
    super('El viaje ya fue iniciado');
  }
}

export class TripChecklistMissingError extends DomainError {
  readonly code = 'TRIP_CHECKLIST_MISSING';
  constructor() {
    super('El conductor no tiene checklist completado para hoy');
  }
}

export class StopNotFoundError extends DomainError {
  readonly code = 'STOP_NOT_FOUND';
  constructor(order: number) {
    super(`Parada ${order} no encontrada`);
  }
}

export class StopAlreadyCompletedError extends DomainError {
  readonly code = 'STOP_ALREADY_COMPLETED';
  constructor(order: number) {
    super(`Parada ${order} ya fue completada`);
  }
}
