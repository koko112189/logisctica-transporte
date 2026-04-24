import type { VehicleStatus } from '../../../domain/enums/vehicle-status.enum';

export class UpdateVehicleCommand {
  constructor(
    public readonly vehicleId: string,
    public readonly tenantId: string,
    public readonly brand?: string,
    public readonly model?: string,
    public readonly year?: number,
    public readonly capacity?: number,
    public readonly observations?: string,
    public readonly status?: VehicleStatus,
  ) {}
}
