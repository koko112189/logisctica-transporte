import { DomiciliaryProfile } from '../entities/domiciliary-profile.entity';

export interface DomiciliaryProfileRepositoryPort {
  save(profile: DomiciliaryProfile): Promise<void>;
  findById(id: string, tenantId: string): Promise<DomiciliaryProfile | null>;
  findByUserId(userId: string, tenantId: string): Promise<DomiciliaryProfile | null>;
  list(tenantId: string, page: number, limit: number, activeOnly: boolean): Promise<{ items: DomiciliaryProfile[]; total: number }>;
}
