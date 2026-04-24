import { Inject, Injectable } from '@nestjs/common';
import {
  DefectNotFoundError,
  VehicleNotFoundError,
} from '../../../domain/errors/vehicle.errors';
import type { VehicleRepositoryPort } from '../../../domain/ports/vehicle.repository.port';
import { VEHICLE_REPOSITORY } from '../../../vehicles.di-tokens';
import { ResolveDefectCommand } from './resolve-defect.command';

@Injectable()
export class ResolveDefectUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicles: VehicleRepositoryPort,
  ) {}

  async execute(command: ResolveDefectCommand): Promise<void> {
    const vehicle = await this.vehicles.findById(
      command.vehicleId,
      command.tenantId,
    );
    if (!vehicle) throw new VehicleNotFoundError(command.vehicleId);

    const defect = vehicle.defects.find((d) => d.id === command.defectId);
    if (!defect) throw new DefectNotFoundError(command.defectId);

    await this.vehicles.save(vehicle.withResolvedDefect(command.defectId));
  }
}
