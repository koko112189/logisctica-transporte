import type { SurveyStatus } from '../../../domain/enums/survey-status.enum';

export class ListDriverSurveysQuery {
  constructor(
    public readonly tenantId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly driverId?: string,
    public readonly status?: SurveyStatus,
    public readonly from?: string,
    public readonly to?: string,
  ) {}
}
