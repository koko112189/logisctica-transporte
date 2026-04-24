import type { PickupPointType } from '../../../domain/enums/pickup-point-type.enum';

export class ListPickupPointsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly type?: PickupPointType,
    public readonly city?: string,
    public readonly isActive?: boolean,
  ) {}
}
