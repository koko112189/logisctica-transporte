import type { Tenant } from '../../../domain/entities/tenant.entity';

export class ListTenantsResult {
  constructor(
    public readonly items: Tenant[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
