import type { VehicleStatus } from '../enums/vehicle-status.enum';
import type { VehicleType } from '../enums/vehicle-type.enum';
import type { Vehicle } from '../entities/vehicle.entity';

export interface VehicleFilters {
  vehicleType?: VehicleType;
  status?: VehicleStatus;
}

export interface VehicleRepositoryPort {
  save(vehicle: Vehicle): Promise<void>;
  findById(id: string, tenantId: string): Promise<Vehicle | null>;
  findByLicensePlate(
    licensePlate: string,
    tenantId: string,
  ): Promise<Vehicle | null>;
  list(
    tenantId: string,
    filters: VehicleFilters,
    skip: number,
    limit: number,
  ): Promise<{ items: Vehicle[]; total: number }>;
}
