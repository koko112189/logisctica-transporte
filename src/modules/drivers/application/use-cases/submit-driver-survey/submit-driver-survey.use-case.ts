import { Inject, Injectable } from '@nestjs/common';
import { SurveyAlreadySubmittedError, SurveyNotFoundError } from '../../../domain/errors/driver.errors';
import { SurveyStatus } from '../../../domain/enums/survey-status.enum';
import type { DriverSurveyRepositoryPort } from '../../../domain/ports/driver-survey.repository.port';
import { DRIVER_SURVEY_REPOSITORY } from '../../../drivers.di-tokens';
import { SubmitDriverSurveyCommand } from './submit-driver-survey.command';

@Injectable()
export class SubmitDriverSurveyUseCase {
  constructor(
    @Inject(DRIVER_SURVEY_REPOSITORY)
    private readonly surveys: DriverSurveyRepositoryPort,
  ) {}

  async execute(command: SubmitDriverSurveyCommand): Promise<void> {
    const survey = await this.surveys.findById(command.surveyId, command.tenantId);
    if (!survey) throw new SurveyNotFoundError(command.surveyId);
    if (survey.status === SurveyStatus.COMPLETED) throw new SurveyAlreadySubmittedError();

    await this.surveys.save(
      survey.submit(
        command.vehicleState,
        command.deliveredItems,
        command.incidents,
        command.chemicalsHandled,
        command.chemicalsDelivered,
        command.observations,
        new Date(),
      ),
    );
  }
}
