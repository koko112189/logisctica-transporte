import { Inject, Injectable } from '@nestjs/common';
import { DomiciliaryProfile } from '../../../domain/entities/domiciliary-profile.entity';
import { DomiciliaryNotFoundError } from '../../../domain/errors/domiciliary.errors';
import type { DomiciliaryProfileRepositoryPort } from '../../../domain/ports/domiciliary-profile.repository.port';
import { DOMICILIARY_PROFILE_REPOSITORY } from '../../../domiciliary.di-tokens';
import { UpdateDomiciliaryProfileCommand } from './update-domiciliary-profile.command';

@Injectable()
export class UpdateDomiciliaryProfileUseCase {
  constructor(
    @Inject(DOMICILIARY_PROFILE_REPOSITORY)
    private readonly repo: DomiciliaryProfileRepositoryPort,
  ) {}

  async execute(cmd: UpdateDomiciliaryProfileCommand): Promise<void> {
    const e = await this.repo.findById(cmd.id, cmd.tenantId);
    if (!e) throw new DomiciliaryNotFoundError();
    const now = new Date();
    const updated = new DomiciliaryProfile(
      e.id,
      e.tenantId,
      e.userId,
      e.fullName,
      cmd.phone !== undefined ? cmd.phone.trim() : e.phone,
      e.documentId,
      cmd.linkedExternalVehicleId !== undefined ? cmd.linkedExternalVehicleId : e.linkedExternalVehicleId,
      cmd.isActive !== undefined ? cmd.isActive : e.isActive,
      e.createdAt,
      now,
    );
    await this.repo.save(updated);
  }
}
