import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class TenantNotFoundError extends DomainError {
  readonly code = 'TENANT_NOT_FOUND';

  constructor(id: string) {
    super(`Empresa no encontrada: ${id}`);
  }
}

export class TenantAlreadyExistsError extends DomainError {
  readonly code = 'TENANT_ALREADY_EXISTS';

  constructor(slug: string) {
    super(`Ya existe una empresa con el identificador: ${slug}`);
  }
}

export class TenantInactiveError extends DomainError {
  readonly code = 'TENANT_INACTIVE';

  constructor(slug: string) {
    super(`La empresa está inactiva: ${slug}`);
  }
}
