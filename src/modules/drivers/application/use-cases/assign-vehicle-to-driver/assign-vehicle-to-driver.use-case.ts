import { Inject, Injectable } from '@nestjs/common';
import { DriverProfileNotFoundError } from '../../../domain/errors/driver.errors';
import type { DriverProfileRepositoryPort } from '../../../domain/ports/driver-profile.repository.port';
import { DRIVER_PROFILE_REPOSITORY } from '../../../drivers.di-tokens';
import { AssignVehicleToDriverCommand } from './assign-vehicle-to-driver.command';

@Injectable()
export class AssignVehicleToDriverUseCase {
  constructor(
    @Inject(DRIVER_PROFILE_REPOSITORY)
    private readonly profiles: DriverProfileRepositoryPort,
  ) {}

  async execute(command: AssignVehicleToDriverCommand): Promise<void> {
    const profile = await this.profiles.findById(command.profileId, command.tenantId);
    if (!profile) throw new DriverProfileNotFoundError(command.profileId);
    await this.profiles.save(profile.assignVehicle(command.vehicleId));
  }
}
