import type { Tenant } from '../entities/tenant.entity';

export interface TenantRepositoryPort {
  save(tenant: Tenant): Promise<void>;
  findById(id: string): Promise<Tenant | null>;
  findBySlug(slug: string): Promise<Tenant | null>;
  list(
    skip: number,
    limit: number,
  ): Promise<{ items: Tenant[]; total: number }>;
}
