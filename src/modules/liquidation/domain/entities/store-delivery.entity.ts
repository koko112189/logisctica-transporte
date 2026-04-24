import { DeliveryStatus } from '../enums/delivery-status.enum';
import type { SupplyItem } from '../value-objects/supply-item.vo';

export class StoreDelivery {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly tripId: string,
    public readonly tripStopOrder: number,
    public readonly pickupPointId: string,
    public readonly supplies: SupplyItem[],
    public readonly merchandiseValue: number,
    public readonly creditNoteId: string | null,
    public readonly status: DeliveryStatus,
    public readonly observations: string,
    public readonly deliveredAt: Date | null,
    public readonly receivedByName: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  private copy(overrides: Partial<StoreDelivery>): StoreDelivery {
    return new StoreDelivery(
      overrides.id ?? this.id,
      overrides.tenantId ?? this.tenantId,
      overrides.tripId ?? this.tripId,
      overrides.tripStopOrder ?? this.tripStopOrder,
      overrides.pickupPointId ?? this.pickupPointId,
      overrides.supplies ?? this.supplies,
      overrides.merchandiseValue ?? this.merchandiseValue,
      overrides.creditNoteId !== undefined ? overrides.creditNoteId : this.creditNoteId,
      overrides.status ?? this.status,
      overrides.observations ?? this.observations,
      overrides.deliveredAt !== undefined ? overrides.deliveredAt : this.deliveredAt,
      overrides.receivedByName !== undefined ? overrides.receivedByName : this.receivedByName,
      this.createdAt,
      new Date(),
    );
  }

  markDelivered(receivedByName: string, now: Date): StoreDelivery {
    return this.copy({ status: DeliveryStatus.DELIVERED, deliveredAt: now, receivedByName });
  }

  markPartial(observations: string, now: Date): StoreDelivery {
    return this.copy({ status: DeliveryStatus.PARTIAL, observations, deliveredAt: now });
  }

  linkCreditNote(creditNoteId: string): StoreDelivery {
    return this.copy({ creditNoteId });
  }
}
