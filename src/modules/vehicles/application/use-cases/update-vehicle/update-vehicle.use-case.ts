import { Inject, Injectable } from '@nestjs/common';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import { VehicleNotFoundError } from '../../../domain/errors/vehicle.errors';
import type { VehicleRepositoryPort } from '../../../domain/ports/vehicle.repository.port';
import { VEHICLE_REPOSITORY } from '../../../vehicles.di-tokens';
import { UpdateVehicleCommand } from './update-vehicle.command';

@Injectable()
export class UpdateVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicles: VehicleRepositoryPort,
  ) {}

  async execute(command: UpdateVehicleCommand): Promise<void> {
    const vehicle = await this.vehicles.findById(
      command.vehicleId,
      command.tenantId,
    );
    if (!vehicle) throw new VehicleNotFoundError(command.vehicleId);

    const updated = new Vehicle(
      vehicle.id,
      vehicle.tenantId,
      vehicle.licensePlate,
      vehicle.vehicleType,
      command.brand ?? vehicle.brand,
      command.model ?? vehicle.model,
      command.year ?? vehicle.year,
      command.capacity ?? vehicle.capacity,
      vehicle.defects,
      vehicle.repairs,
      command.observations ?? vehicle.observations,
      vehicle.linkedDriverId,
      command.status ?? vehicle.status,
      vehicle.createdAt,
      new Date(),
    );
    await this.vehicles.save(updated);
  }
}
