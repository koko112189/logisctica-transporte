import { LightVehicleKind } from '../../../domain/enums/light-vehicle-kind.enum';

export class CreateExternalVehicleCommand {
  constructor(
    public readonly tenantId: string,
    public readonly carrierId: string,
    public readonly licensePlate: string,
    public readonly kind: LightVehicleKind,
    public readonly label: string,
    public readonly capacityKg: number,
    public readonly notes: string,
  ) {}
}
