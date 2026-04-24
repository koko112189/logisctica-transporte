import type { Trip } from '../entities/trip.entity';
import type { TripStatus } from '../enums/trip-status.enum';
import type { VehicleCategory } from '../enums/vehicle-category.enum';

export interface TripFilters {
  vehicleId?: string;
  driverId?: string;
  status?: TripStatus;
  vehicleCategory?: VehicleCategory;
  isExternalCarrier?: boolean;
  from?: Date;
  to?: Date;
}

export interface TripRepositoryPort {
  save(trip: Trip): Promise<void>;
  findById(id: string, tenantId: string): Promise<Trip | null>;
  findAll(
    tenantId: string,
    filters: TripFilters,
    page: number,
    limit: number,
  ): Promise<{ items: Trip[]; total: number }>;
  findActiveByVehicle(vehicleId: string, tenantId: string): Promise<Trip | null>;
  findActiveByDriver(driverId: string, tenantId: string): Promise<Trip | null>;
}
