import type { DriverProfile } from '../entities/driver-profile.entity';

export interface DriverProfileRepositoryPort {
  save(profile: DriverProfile): Promise<void>;
  findById(id: string, tenantId: string): Promise<DriverProfile | null>;
  findByUserId(userId: string, tenantId: string): Promise<DriverProfile | null>;
  findAll(tenantId: string, page: number, limit: number): Promise<{ items: DriverProfile[]; total: number }>;
}
