import { ExternalVehicle } from '../entities/external-vehicle.entity';

export interface ExternalVehicleRepositoryPort {
  save(vehicle: ExternalVehicle): Promise<void>;
  findById(id: string, tenantId: string): Promise<ExternalVehicle | null>;
  listByCarrier(carrierId: string, tenantId: string, page: number, limit: number): Promise<{ items: ExternalVehicle[]; total: number }>;
  findByPlate(plate: string, tenantId: string): Promise<ExternalVehicle | null>;
}
