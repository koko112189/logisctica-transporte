import { Inject, Injectable } from '@nestjs/common';
import { ExternalCarrier } from '../../../domain/entities/external-carrier.entity';
import type { ExternalCarrierRepositoryPort } from '../../../domain/ports/external-carrier.repository.port';
import { EXTERNAL_CARRIER_REPOSITORY } from '../../../carriers.di-tokens';

@Injectable()
export class ListExternalCarriersUseCase {
  constructor(
    @Inject(EXTERNAL_CARRIER_REPOSITORY)
    private readonly carriers: ExternalCarrierRepositoryPort,
  ) {}

  async execute(
    tenantId: string,
    page: number,
    limit: number,
    activeOnly: boolean,
  ): Promise<{ items: ExternalCarrier[]; total: number }> {
    return this.carriers.list(tenantId, page, limit, activeOnly);
  }
}
