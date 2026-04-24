import { Inject, Injectable } from '@nestjs/common';
import type { VehicleRepositoryPort } from '../../../domain/ports/vehicle.repository.port';
import { VEHICLE_REPOSITORY } from '../../../vehicles.di-tokens';
import { ListVehiclesQuery } from './list-vehicles.query';
import { ListVehiclesResult } from './list-vehicles.result';

@Injectable()
export class ListVehiclesUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicles: VehicleRepositoryPort,
  ) {}

  async execute(query: ListVehiclesQuery): Promise<ListVehiclesResult> {
    const skip = (query.page - 1) * query.limit;
    const { items, total } = await this.vehicles.list(
      query.tenantId,
      { vehicleType: query.vehicleType, status: query.status },
      skip,
      query.limit,
    );
    return new ListVehiclesResult(items, total, query.page, query.limit);
  }
}
