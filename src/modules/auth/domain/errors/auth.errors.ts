import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class InvalidCredentialsError extends DomainError {
  readonly code = 'INVALID_CREDENTIALS';
  constructor() {
    super('Correo o contraseña incorrectos');
  }
}

export class TokenExpiredError extends DomainError {
  readonly code = 'TOKEN_EXPIRED';
  constructor() {
    super('El token ha expirado');
  }
}

export class TokenInvalidError extends DomainError {
  readonly code = 'TOKEN_INVALID';
  constructor() {
    super('Token inválido');
  }
}

export class UserInactiveError extends DomainError {
  readonly code = 'USER_INACTIVE';
  constructor() {
    super('El usuario está inactivo');
  }
}
