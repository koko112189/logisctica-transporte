import { Inject, Injectable } from '@nestjs/common';
import type { DriverSurvey } from '../../../domain/entities/driver-survey.entity';
import type { DriverSurveyRepositoryPort } from '../../../domain/ports/driver-survey.repository.port';
import { DRIVER_SURVEY_REPOSITORY } from '../../../drivers.di-tokens';
import { GetPendingSurveysForDriverQuery } from './get-pending-surveys-for-driver.query';

@Injectable()
export class GetPendingSurveysForDriverUseCase {
  constructor(
    @Inject(DRIVER_SURVEY_REPOSITORY)
    private readonly surveys: DriverSurveyRepositoryPort,
  ) {}

  async execute(query: GetPendingSurveysForDriverQuery): Promise<DriverSurvey[]> {
    return this.surveys.findPendingByDriver(query.driverId, query.tenantId);
  }
}
