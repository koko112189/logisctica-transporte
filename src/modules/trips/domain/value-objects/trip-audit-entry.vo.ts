import type { TripEvent } from '../enums/trip-event.enum';

export class TripAuditEntry {
  constructor(
    public readonly timestamp: Date,
    public readonly event: TripEvent,
    public readonly description: string,
    public readonly metadata: Record<string, unknown> | null,
    public readonly performedByUserId: string | null,
  ) {}
}
