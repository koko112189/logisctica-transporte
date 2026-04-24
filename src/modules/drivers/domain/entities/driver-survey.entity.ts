import type { DeliveredItem } from '../value-objects/delivered-item.vo';
import type { Incident } from '../value-objects/incident.vo';
import type { VehicleStateLevel } from '../enums/vehicle-state-level.enum';
import { SurveyStatus } from '../enums/survey-status.enum';

export class DriverSurvey {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly driverId: string,
    public readonly vehicleId: string,
    public readonly date: string, // 'YYYY-MM-DD'
    public readonly vehicleState: VehicleStateLevel | null,
    public readonly deliveredItems: DeliveredItem[],
    public readonly incidents: Incident[],
    public readonly chemicalsHandled: boolean,
    public readonly chemicalsDelivered: boolean | null,
    public readonly observations: string,
    public readonly status: SurveyStatus,
    public readonly submittedAt: Date | null,
    public readonly createdAt: Date,
  ) {}

  submit(
    vehicleState: VehicleStateLevel,
    deliveredItems: DeliveredItem[],
    incidents: Incident[],
    chemicalsHandled: boolean,
    chemicalsDelivered: boolean | null,
    observations: string,
    now: Date,
  ): DriverSurvey {
    return new DriverSurvey(
      this.id, this.tenantId, this.driverId, this.vehicleId, this.date,
      vehicleState, deliveredItems, incidents,
      chemicalsHandled, chemicalsDelivered, observations,
      SurveyStatus.COMPLETED, now, this.createdAt,
    );
  }
}
