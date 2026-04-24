import { Inject, Injectable } from '@nestjs/common';
import type { TenantRepositoryPort } from '../../../domain/ports/tenant.repository.port';
import { TENANT_REPOSITORY } from '../../../tenants.di-tokens';
import { ListTenantsQuery } from './list-tenants.query';
import { ListTenantsResult } from './list-tenants.result';

@Injectable()
export class ListTenantsUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenants: TenantRepositoryPort,
  ) {}

  async execute(query: ListTenantsQuery): Promise<ListTenantsResult> {
    const page = query.page > 0 ? query.page : 1;
    const limit = query.limit > 0 ? Math.min(query.limit, 100) : 20;
    const skip = (page - 1) * limit;
    const { items, total } = await this.tenants.list(skip, limit);
    return new ListTenantsResult(items, total, page, limit);
  }
}
