import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class PickupPointNotFoundError extends DomainError {
  readonly code = 'PICKUP_POINT_NOT_FOUND';
  constructor(id: string) {
    super(`Punto de recogida ${id} no encontrado`);
  }
}
