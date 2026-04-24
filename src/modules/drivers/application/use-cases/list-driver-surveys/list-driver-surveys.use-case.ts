import { Inject, Injectable } from '@nestjs/common';
import type { DriverSurvey } from '../../../domain/entities/driver-survey.entity';
import type { DriverSurveyRepositoryPort } from '../../../domain/ports/driver-survey.repository.port';
import { DRIVER_SURVEY_REPOSITORY } from '../../../drivers.di-tokens';
import { ListDriverSurveysQuery } from './list-driver-surveys.query';

@Injectable()
export class ListDriverSurveysUseCase {
  constructor(
    @Inject(DRIVER_SURVEY_REPOSITORY)
    private readonly surveys: DriverSurveyRepositoryPort,
  ) {}

  async execute(query: ListDriverSurveysQuery): Promise<{ items: DriverSurvey[]; total: number }> {
    return this.surveys.findAll(
      query.tenantId,
      { driverId: query.driverId, status: query.status, from: query.from, to: query.to },
      query.page,
      query.limit,
    );
  }
}
