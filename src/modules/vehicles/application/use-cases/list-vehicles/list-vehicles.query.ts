import type { VehicleStatus } from '../../../domain/enums/vehicle-status.enum';
import type { VehicleType } from '../../../domain/enums/vehicle-type.enum';

export class ListVehiclesQuery {
  constructor(
    public readonly tenantId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly vehicleType?: VehicleType,
    public readonly status?: VehicleStatus,
  ) {}
}
