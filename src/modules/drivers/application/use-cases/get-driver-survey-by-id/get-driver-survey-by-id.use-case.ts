import { Inject, Injectable } from '@nestjs/common';
import type { DriverSurvey } from '../../../domain/entities/driver-survey.entity';
import { SurveyNotFoundError } from '../../../domain/errors/driver.errors';
import type { DriverSurveyRepositoryPort } from '../../../domain/ports/driver-survey.repository.port';
import { DRIVER_SURVEY_REPOSITORY } from '../../../drivers.di-tokens';
import { GetDriverSurveyByIdQuery } from './get-driver-survey-by-id.query';

@Injectable()
export class GetDriverSurveyByIdUseCase {
  constructor(
    @Inject(DRIVER_SURVEY_REPOSITORY)
    private readonly surveys: DriverSurveyRepositoryPort,
  ) {}

  async execute(query: GetDriverSurveyByIdQuery): Promise<DriverSurvey> {
    const survey = await this.surveys.findById(query.surveyId, query.tenantId);
    if (!survey) throw new SurveyNotFoundError(query.surveyId);
    return survey;
  }
}
