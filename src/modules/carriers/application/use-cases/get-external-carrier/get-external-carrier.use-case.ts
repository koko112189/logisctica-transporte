import { Inject, Injectable } from '@nestjs/common';
import { ExternalCarrier } from '../../../domain/entities/external-carrier.entity';
import { ExternalCarrierNotFoundError } from '../../../domain/errors/carrier.errors';
import type { ExternalCarrierRepositoryPort } from '../../../domain/ports/external-carrier.repository.port';
import { EXTERNAL_CARRIER_REPOSITORY } from '../../../carriers.di-tokens';

@Injectable()
export class GetExternalCarrierUseCase {
  constructor(
    @Inject(EXTERNAL_CARRIER_REPOSITORY)
    private readonly carriers: ExternalCarrierRepositoryPort,
  ) {}

  async execute(id: string, tenantId: string): Promise<ExternalCarrier> {
    const c = await this.carriers.findById(id, tenantId);
    if (!c) throw new ExternalCarrierNotFoundError();
    return c;
  }
}
