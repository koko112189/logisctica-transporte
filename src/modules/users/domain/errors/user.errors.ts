import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class UserNotFoundError extends DomainError {
  readonly code = 'USER_NOT_FOUND';

  constructor(id: string) {
    super(`Usuario no encontrado: ${id}`);
  }
}

export class UserAlreadyExistsError extends DomainError {
  readonly code = 'USER_ALREADY_EXISTS';

  constructor(email: string) {
    super(`Ya existe un usuario con el correo: ${email}`);
  }
}
