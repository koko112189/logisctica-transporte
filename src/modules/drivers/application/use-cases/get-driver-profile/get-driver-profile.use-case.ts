import { Inject, Injectable } from '@nestjs/common';
import type { DriverProfile } from '../../../domain/entities/driver-profile.entity';
import { DriverProfileNotFoundError } from '../../../domain/errors/driver.errors';
import type { DriverProfileRepositoryPort } from '../../../domain/ports/driver-profile.repository.port';
import { DRIVER_PROFILE_REPOSITORY } from '../../../drivers.di-tokens';
import { GetDriverProfileQuery } from './get-driver-profile.query';

@Injectable()
export class GetDriverProfileUseCase {
  constructor(
    @Inject(DRIVER_PROFILE_REPOSITORY)
    private readonly profiles: DriverProfileRepositoryPort,
  ) {}

  async execute(query: GetDriverProfileQuery): Promise<DriverProfile> {
    const profile = await this.profiles.findById(query.profileId, query.tenantId);
    if (!profile) throw new DriverProfileNotFoundError(query.profileId);
    return profile;
  }
}
