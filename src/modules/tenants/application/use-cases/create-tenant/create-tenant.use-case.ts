import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Tenant } from '../../../domain/entities/tenant.entity';
import { TenantAlreadyExistsError } from '../../../domain/errors/tenant.errors';
import type { TenantRepositoryPort } from '../../../domain/ports/tenant.repository.port';
import { TENANT_REPOSITORY } from '../../../tenants.di-tokens';
import { CreateTenantCommand } from './create-tenant.command';
import { CreateTenantResult } from './create-tenant.result';

@Injectable()
export class CreateTenantUseCase {
  constructor(
    @Inject(TENANT_REPOSITORY)
    private readonly tenants: TenantRepositoryPort,
  ) {}

  async execute(command: CreateTenantCommand): Promise<CreateTenantResult> {
    const slug = command.slug.trim().toLowerCase().replace(/\s+/g, '-');
    const existing = await this.tenants.findBySlug(slug);
    if (existing) {
      throw new TenantAlreadyExistsError(slug);
    }
    const now = new Date();
    const tenant = new Tenant(
      randomUUID(),
      command.name.trim(),
      slug,
      true,
      now,
      now,
    );
    await this.tenants.save(tenant);
    return new CreateTenantResult(tenant.id);
  }
}
