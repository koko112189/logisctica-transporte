import { Inject, Injectable } from '@nestjs/common';
import type { Tenant } from '../../../domain/entities/tenant.entity';
import { TenantNotFoundError } from '../../../domain/errors/tenant.errors';
import type { TenantRepositoryPort } from '../../../domain/ports/tenant.repository.port';
import { TENANT_REPOSITORY } from '../../../tenants.di-tokens';
import { GetTenantByIdQuery } from './get-tenant-by-id.query';

@Injectable()
export class GetTenantByIdUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenants: TenantRepositoryPort,
  ) {}

  async execute(query: GetTenantByIdQuery): Promise<Tenant> {
    const tenant = await this.tenants.findById(query.id);
    if (!tenant) {
      throw new TenantNotFoundError(query.id);
    }
    return tenant;
  }
}
