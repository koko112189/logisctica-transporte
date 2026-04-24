import type { PickupPointType } from '../../../domain/enums/pickup-point-type.enum';

export class CreatePickupPointCommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly type: PickupPointType,
    public readonly address: string,
    public readonly city: string,
    public readonly postalCode: string | null,
    public readonly lat: number | null,
    public readonly lng: number | null,
    public readonly contactName: string | null,
    public readonly contactPhone: string | null,
    public readonly contactEmail: string | null,
    public readonly operatingHours: string | null,
  ) {}
}
