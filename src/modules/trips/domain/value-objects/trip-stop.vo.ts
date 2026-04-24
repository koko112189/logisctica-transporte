import type { StopStatus } from '../enums/stop-status.enum';
import type { StopType } from '../enums/stop-type.enum';

export class TripStop {
  constructor(
    public readonly stopOrder: number,
    public readonly pickupPointId: string,
    public readonly type: StopType,
    public readonly scheduledArrival: Date | null,
    public readonly actualArrival: Date | null,
    public readonly status: StopStatus,
    public readonly notes: string | null,
    public readonly storeDeliveryId: string | null,
  ) {}
}
