import type { DeliveredItem } from '../../../domain/value-objects/delivered-item.vo';
import type { Incident } from '../../../domain/value-objects/incident.vo';
import type { VehicleStateLevel } from '../../../domain/enums/vehicle-state-level.enum';

export class SubmitDriverSurveyCommand {
  constructor(
    public readonly surveyId: string,
    public readonly tenantId: string,
    public readonly vehicleState: VehicleStateLevel,
    public readonly deliveredItems: DeliveredItem[],
    public readonly incidents: Incident[],
    public readonly chemicalsHandled: boolean,
    public readonly chemicalsDelivered: boolean | null,
    public readonly observations: string,
  ) {}
}
