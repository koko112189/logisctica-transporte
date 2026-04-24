import { CoordinatesVO } from '../../../../shared/domain/value-objects/coordinates.vo';

export class Warehouse {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly address: string,
    public readonly city: string,
    public readonly notificationEmail: string,
    public readonly phone: string,
    public readonly coordinates: CoordinatesVO | null,
    public readonly alertOnTripDispatch: boolean,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
