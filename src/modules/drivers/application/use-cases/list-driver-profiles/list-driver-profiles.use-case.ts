import { Inject, Injectable } from '@nestjs/common';
import type { DriverProfile } from '../../../domain/entities/driver-profile.entity';
import type { DriverProfileRepositoryPort } from '../../../domain/ports/driver-profile.repository.port';
import { DRIVER_PROFILE_REPOSITORY } from '../../../drivers.di-tokens';
import { ListDriverProfilesQuery } from './list-driver-profiles.query';

@Injectable()
export class ListDriverProfilesUseCase {
  constructor(
    @Inject(DRIVER_PROFILE_REPOSITORY)
    private readonly profiles: DriverProfileRepositoryPort,
  ) {}

  async execute(query: ListDriverProfilesQuery): Promise<{ items: DriverProfile[]; total: number }> {
    return this.profiles.findAll(query.tenantId, query.page, query.limit);
  }
}
