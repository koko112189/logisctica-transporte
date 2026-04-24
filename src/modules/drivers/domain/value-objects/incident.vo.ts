import type { IncidentSeverity } from '../enums/incident-severity.enum';
import type { IncidentType } from '../enums/incident-type.enum';

export class Incident {
  constructor(
    public readonly type: IncidentType,
    public readonly description: string,
    public readonly severity: IncidentSeverity,
  ) {}
}
