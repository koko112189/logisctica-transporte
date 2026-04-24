import { DomainError } from '../../../../shared/domain/errors/domain.error';

export class DriverProfileNotFoundError extends DomainError {
  readonly code = 'DRIVER_PROFILE_NOT_FOUND';
  constructor(id: string) {
    super(`Perfil de conductor ${id} no encontrado`);
  }
}

export class SurveyNotFoundError extends DomainError {
  readonly code = 'SURVEY_NOT_FOUND';
  constructor(id: string) {
    super(`Encuesta ${id} no encontrada`);
  }
}

export class SurveyAlreadySubmittedError extends DomainError {
  readonly code = 'SURVEY_ALREADY_SUBMITTED';
  constructor() {
    super('La encuesta ya fue enviada');
  }
}
