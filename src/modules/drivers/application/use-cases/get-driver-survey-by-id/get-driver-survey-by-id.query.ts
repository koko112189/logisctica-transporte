export class GetDriverSurveyByIdQuery {
  constructor(
    public readonly surveyId: string,
    public readonly tenantId: string,
  ) {}
}
