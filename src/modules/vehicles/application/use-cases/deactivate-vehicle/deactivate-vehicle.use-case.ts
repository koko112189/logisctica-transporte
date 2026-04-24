import { Inject, Injectable } from '@nestjs/common';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import { VehicleStatus } from '../../../domain/enums/vehicle-status.enum';
import { VehicleNotFoundError } from '../../../domain/errors/vehicle.errors';
import type { VehicleRepositoryPort } from '../../../domain/ports/vehicle.repository.port';
import { VEHICLE_REPOSITORY } from '../../../vehicles.di-tokens';
import { DeactivateVehicleCommand } from './deactivate-vehicle.command';

@Injectable()
export class DeactivateVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicles: VehicleRepositoryPort,
  ) {}

  async execute(command: DeactivateVehicleCommand): Promise<void> {
    const vehicle = await this.vehicles.findById(
      command.vehicleId,
      command.tenantId,
    );
    if (!vehicle) throw new VehicleNotFoundError(command.vehicleId);

    const deactivated = new Vehicle(
      vehicle.id, vehicle.tenantId, vehicle.licensePlate, vehicle.vehicleType,
      vehicle.brand, vehicle.model, vehicle.year, vehicle.capacity,
      vehicle.defects, vehicle.repairs, vehicle.observations,
      vehicle.linkedDriverId, VehicleStatus.INACTIVE,
      vehicle.createdAt, new Date(),
    );
    await this.vehicles.save(deactivated);
  }
}
