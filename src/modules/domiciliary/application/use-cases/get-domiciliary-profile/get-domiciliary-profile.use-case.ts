import { Inject, Injectable } from '@nestjs/common';
import { DomiciliaryProfile } from '../../../domain/entities/domiciliary-profile.entity';
import { DomiciliaryNotFoundError } from '../../../domain/errors/domiciliary.errors';
import type { DomiciliaryProfileRepositoryPort } from '../../../domain/ports/domiciliary-profile.repository.port';
import { DOMICILIARY_PROFILE_REPOSITORY } from '../../../domiciliary.di-tokens';

@Injectable()
export class GetDomiciliaryProfileUseCase {
  constructor(
    @Inject(DOMICILIARY_PROFILE_REPOSITORY)
    private readonly repo: DomiciliaryProfileRepositoryPort,
  ) {}

  async execute(id: string, tenantId: string): Promise<DomiciliaryProfile> {
    const p = await this.repo.findById(id, tenantId);
    if (!p) throw new DomiciliaryNotFoundError();
    return p;
  }
}
