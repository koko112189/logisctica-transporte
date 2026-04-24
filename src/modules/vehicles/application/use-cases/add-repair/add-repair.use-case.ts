import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Repair } from '../../../domain/value-objects/repair.vo';
import { VehicleNotFoundError } from '../../../domain/errors/vehicle.errors';
import type { VehicleRepositoryPort } from '../../../domain/ports/vehicle.repository.port';
import { VEHICLE_REPOSITORY } from '../../../vehicles.di-tokens';
import { AddRepairCommand } from './add-repair.command';

@Injectable()
export class AddRepairUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicles: VehicleRepositoryPort,
  ) {}

  async execute(command: AddRepairCommand): Promise<{ repairId: string }> {
    const vehicle = await this.vehicles.findById(
      command.vehicleId,
      command.tenantId,
    );
    if (!vehicle) throw new VehicleNotFoundError(command.vehicleId);

    const repairId = randomUUID();
    const repair = new Repair(
      repairId,
      command.description,
      command.date,
      command.cost,
      command.mechanic,
      command.notes,
    );
    await this.vehicles.save(vehicle.withRepair(repair));
    return { repairId };
  }
}
