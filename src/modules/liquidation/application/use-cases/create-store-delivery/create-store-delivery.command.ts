import type { SupplyItem } from '../../../domain/value-objects/supply-item.vo';

export class CreateStoreDeliveryCommand {
  constructor(
    public readonly tenantId: string,
    public readonly tripId: string,
    public readonly tripStopOrder: number,
    public readonly pickupPointId: string,
    public readonly supplies: SupplyItem[],
    public readonly merchandiseValue: number,
    public readonly observations: string,
  ) {}
}
