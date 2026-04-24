import { LightVehicleKind } from '../enums/light-vehicle-kind.enum';

export class ExternalVehicle {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly carrierId: string,
    public readonly licensePlate: string,
    public readonly kind: LightVehicleKind,
    public readonly label: string,
    public readonly capacityKg: number,
    public readonly isActive: boolean,
    public readonly notes: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
