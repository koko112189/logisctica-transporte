import type { TripStatus } from '../../../domain/enums/trip-status.enum';
import type { VehicleCategory } from '../../../domain/enums/vehicle-category.enum';

export class ListTripsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly page: number,
    public readonly limit: number,
    public readonly vehicleId?: string,
    public readonly driverId?: string,
    public readonly status?: TripStatus,
    public readonly vehicleCategory?: VehicleCategory,
    public readonly isExternalCarrier?: boolean,
    public readonly from?: Date,
    public readonly to?: Date,
  ) {}
}
