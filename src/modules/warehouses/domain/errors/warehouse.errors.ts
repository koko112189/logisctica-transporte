import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class WarehouseNotFoundError extends DomainError {
  readonly code = 'WAREHOUSE_NOT_FOUND';
  constructor() {
    super('Bodega no encontrada');
  }
}
