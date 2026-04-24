import { Inject, Injectable } from '@nestjs/common';
import type { Vehicle } from '../../../domain/entities/vehicle.entity';
import { VehicleNotFoundError } from '../../../domain/errors/vehicle.errors';
import type { VehicleRepositoryPort } from '../../../domain/ports/vehicle.repository.port';
import { VEHICLE_REPOSITORY } from '../../../vehicles.di-tokens';
import { GetVehicleByIdQuery } from './get-vehicle-by-id.query';

@Injectable()
export class GetVehicleByIdUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicles: VehicleRepositoryPort,
  ) {}

  async execute(query: GetVehicleByIdQuery): Promise<Vehicle> {
    const vehicle = await this.vehicles.findById(
      query.vehicleId,
      query.tenantId,
    );
    if (!vehicle) throw new VehicleNotFoundError(query.vehicleId);
    return vehicle;
  }
}
