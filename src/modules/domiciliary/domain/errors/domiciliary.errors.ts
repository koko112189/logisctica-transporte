import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class DomiciliaryUserAlreadyRegisteredError extends DomainError {
  readonly code = 'DOMICILIARY_USER_DUPLICATE';
  constructor() {
    super('Ya existe un perfil de domiciliario para este usuario');
  }
}

export class DomiciliaryNotFoundError extends DomainError {
  readonly code = 'DOMICILIARY_NOT_FOUND';
  constructor() {
    super('Domiciliario no encontrado');
  }
}
