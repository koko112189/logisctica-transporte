import type { CoordinatesVO } from '../../../../shared/domain/value-objects/coordinates.vo';
import type { PickupPointType } from '../enums/pickup-point-type.enum';

export class PickupPoint {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly type: PickupPointType,
    public readonly address: string,
    public readonly city: string,
    public readonly postalCode: string | null,
    public readonly coordinates: CoordinatesVO | null,
    public readonly contactName: string | null,
    public readonly contactPhone: string | null,
    public readonly contactEmail: string | null,
    public readonly operatingHours: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  withUpdatedFields(fields: {
    name?: string;
    type?: PickupPointType;
    address?: string;
    city?: string;
    postalCode?: string | null;
    coordinates?: CoordinatesVO | null;
    contactName?: string | null;
    contactPhone?: string | null;
    contactEmail?: string | null;
    operatingHours?: string | null;
  }): PickupPoint {
    return new PickupPoint(
      this.id, this.tenantId,
      fields.name ?? this.name,
      fields.type ?? this.type,
      fields.address ?? this.address,
      fields.city ?? this.city,
      fields.postalCode !== undefined ? fields.postalCode : this.postalCode,
      fields.coordinates !== undefined ? fields.coordinates : this.coordinates,
      fields.contactName !== undefined ? fields.contactName : this.contactName,
      fields.contactPhone !== undefined ? fields.contactPhone : this.contactPhone,
      fields.contactEmail !== undefined ? fields.contactEmail : this.contactEmail,
      fields.operatingHours !== undefined ? fields.operatingHours : this.operatingHours,
      this.isActive, this.createdAt, new Date(),
    );
  }

  deactivate(): PickupPoint {
    return new PickupPoint(
      this.id, this.tenantId, this.name, this.type,
      this.address, this.city, this.postalCode, this.coordinates,
      this.contactName, this.contactPhone, this.contactEmail, this.operatingHours,
      false, this.createdAt, new Date(),
    );
  }
}
