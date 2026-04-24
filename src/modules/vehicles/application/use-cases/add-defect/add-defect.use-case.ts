import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Defect } from '../../../domain/value-objects/defect.vo';
import { VehicleNotFoundError } from '../../../domain/errors/vehicle.errors';
import type { VehicleRepositoryPort } from '../../../domain/ports/vehicle.repository.port';
import { VEHICLE_REPOSITORY } from '../../../vehicles.di-tokens';
import { AddDefectCommand } from './add-defect.command';

@Injectable()
export class AddDefectUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicles: VehicleRepositoryPort,
  ) {}

  async execute(command: AddDefectCommand): Promise<{ defectId: string }> {
    const vehicle = await this.vehicles.findById(
      command.vehicleId,
      command.tenantId,
    );
    if (!vehicle) throw new VehicleNotFoundError(command.vehicleId);

    const defectId = randomUUID();
    const defect = Defect.open(defectId, command.description);
    await this.vehicles.save(vehicle.withDefect(defect));
    return { defectId };
  }
}
