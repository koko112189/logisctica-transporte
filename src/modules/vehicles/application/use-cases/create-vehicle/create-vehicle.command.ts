import type { VehicleType } from '../../../domain/enums/vehicle-type.enum';

export class CreateVehicleCommand {
  constructor(
    public readonly tenantId: string,
    public readonly licensePlate: string,
    public readonly vehicleType: VehicleType,
    public readonly brand: string,
    public readonly model: string,
    public readonly year: number,
    public readonly capacity: number,
    public readonly observations: string,
  ) {}
}
