import { Inject, Injectable } from '@nestjs/common';
import { ExternalVehicle } from '../../../domain/entities/external-vehicle.entity';
import { ExternalCarrierNotFoundError } from '../../../domain/errors/carrier.errors';
import type { ExternalCarrierRepositoryPort } from '../../../domain/ports/external-carrier.repository.port';
import type { ExternalVehicleRepositoryPort } from '../../../domain/ports/external-vehicle.repository.port';
import { EXTERNAL_CARRIER_REPOSITORY, EXTERNAL_VEHICLE_REPOSITORY } from '../../../carriers.di-tokens';

@Injectable()
export class ListExternalVehiclesUseCase {
  constructor(
    @Inject(EXTERNAL_CARRIER_REPOSITORY)
    private readonly carriers: ExternalCarrierRepositoryPort,
    @Inject(EXTERNAL_VEHICLE_REPOSITORY)
    private readonly vehicles: ExternalVehicleRepositoryPort,
  ) {}

  async execute(
    carrierId: string,
    tenantId: string,
    page: number,
    limit: number,
  ): Promise<{ items: ExternalVehicle[]; total: number }> {
    const c = await this.carriers.findById(carrierId, tenantId);
    if (!c) throw new ExternalCarrierNotFoundError();
    return this.vehicles.listByCarrier(carrierId, tenantId, page, limit);
  }
}
