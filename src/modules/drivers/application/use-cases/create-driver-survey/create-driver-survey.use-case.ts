import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DriverSurvey } from '../../../domain/entities/driver-survey.entity';
import { SurveyStatus } from '../../../domain/enums/survey-status.enum';
import type { DriverSurveyRepositoryPort } from '../../../domain/ports/driver-survey.repository.port';
import { DRIVER_SURVEY_REPOSITORY } from '../../../drivers.di-tokens';
import { CreateDriverSurveyCommand } from './create-driver-survey.command';

@Injectable()
export class CreateDriverSurveyUseCase {
  constructor(
    @Inject(DRIVER_SURVEY_REPOSITORY)
    private readonly surveys: DriverSurveyRepositoryPort,
  ) {}

  async execute(command: CreateDriverSurveyCommand): Promise<{ surveyId: string }> {
    const survey = new DriverSurvey(
      randomUUID(),
      command.tenantId,
      command.driverId,
      command.vehicleId,
      command.date,
      null,
      [],
      [],
      false,
      null,
      '',
      SurveyStatus.PENDING,
      null,
      new Date(),
    );
    await this.surveys.save(survey);
    return { surveyId: survey.id };
  }
}
