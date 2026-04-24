import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DriverProfile } from '../../../domain/entities/driver-profile.entity';
import type { DriverProfileRepositoryPort } from '../../../domain/ports/driver-profile.repository.port';
import { DRIVER_PROFILE_REPOSITORY } from '../../../drivers.di-tokens';
import { CreateDriverProfileCommand } from './create-driver-profile.command';

@Injectable()
export class CreateDriverProfileUseCase {
  constructor(
    @Inject(DRIVER_PROFILE_REPOSITORY)
    private readonly profiles: DriverProfileRepositoryPort,
  ) {}

  async execute(command: CreateDriverProfileCommand): Promise<{ profileId: string }> {
    const now = new Date();
    const profile = new DriverProfile(
      randomUUID(),
      command.tenantId,
      command.userId,
      command.licenseNumber,
      command.licenseExpiry,
      null,
      true,
      now,
      now,
    );
    await this.profiles.save(profile);
    return { profileId: profile.id };
  }
}
