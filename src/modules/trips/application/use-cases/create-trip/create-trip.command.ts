import type { StopType } from '../../../domain/enums/stop-type.enum';
import type { VehicleCategory } from '../../../domain/enums/vehicle-category.enum';

export interface StopInput {
  stopOrder: number;
  pickupPointId: string;
  type: StopType;
  scheduledArrival?: string; // ISO string
  notes?: string;
}

export class CreateTripCommand {
  constructor(
    public readonly tenantId: string,
    public readonly vehicleId: string,
    public readonly driverId: string,
    public readonly vehicleCategory: VehicleCategory,
    public readonly originAddress: string,
    public readonly originCity: string,
    public readonly originLat: number | null,
    public readonly originLng: number | null,
    public readonly destinationAddress: string,
    public readonly destinationCity: string,
    public readonly destinationLat: number | null,
    public readonly destinationLng: number | null,
    public readonly stops: StopInput[],
    public readonly appointmentId: string | null,
    public readonly isExternalCarrier: boolean,
    public readonly domiciliaryId: string | null,
    public readonly externalCarrierId: string | null,
    public readonly externalVehicleId: string | null,
    public readonly originWarehouseId: string | null,
    public readonly estimatedArrival: Date | null,
    public readonly performedByUserId: string | null,
  ) {}
}
