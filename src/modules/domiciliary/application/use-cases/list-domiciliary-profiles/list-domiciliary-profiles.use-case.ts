import { Inject, Injectable } from '@nestjs/common';
import { DomiciliaryProfile } from '../../../domain/entities/domiciliary-profile.entity';
import type { DomiciliaryProfileRepositoryPort } from '../../../domain/ports/domiciliary-profile.repository.port';
import { DOMICILIARY_PROFILE_REPOSITORY } from '../../../domiciliary.di-tokens';

@Injectable()
export class ListDomiciliaryProfilesUseCase {
  constructor(
    @Inject(DOMICILIARY_PROFILE_REPOSITORY)
    private readonly repo: DomiciliaryProfileRepositoryPort,
  ) {}

  async execute(
    tenantId: string,
    page: number,
    limit: number,
    activeOnly: boolean,
  ): Promise<{ items: DomiciliaryProfile[]; total: number }> {
    return this.repo.list(tenantId, page, limit, activeOnly);
  }
}
