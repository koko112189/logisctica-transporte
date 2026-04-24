import type { DriverSurvey } from '../entities/driver-survey.entity';
import type { SurveyStatus } from '../enums/survey-status.enum';

export interface SurveyFilters {
  driverId?: string;
  status?: SurveyStatus;
  from?: string; // 'YYYY-MM-DD'
  to?: string;   // 'YYYY-MM-DD'
}

export interface DriverSurveyRepositoryPort {
  save(survey: DriverSurvey): Promise<void>;
  findById(id: string, tenantId: string): Promise<DriverSurvey | null>;
  findPendingByDriver(driverId: string, tenantId: string): Promise<DriverSurvey[]>;
  findAll(
    tenantId: string,
    filters: SurveyFilters,
    page: number,
    limit: number,
  ): Promise<{ items: DriverSurvey[]; total: number }>;
}
