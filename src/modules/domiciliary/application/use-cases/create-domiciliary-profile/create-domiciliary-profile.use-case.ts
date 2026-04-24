import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'node:crypto';
import { CalypsoEvents } from '../../../../../shared/events/calypso-events';
import { DomiciliaryProfile } from '../../../domain/entities/domiciliary-profile.entity';
import { DomiciliaryUserAlreadyRegisteredError } from '../../../domain/errors/domiciliary.errors';
import type { DomiciliaryProfileRepositoryPort } from '../../../domain/ports/domiciliary-profile.repository.port';
import { DOMICILIARY_PROFILE_REPOSITORY } from '../../../domiciliary.di-tokens';
import { CreateDomiciliaryProfileCommand } from './create-domiciliary-profile.command';

@Injectable()
export class CreateDomiciliaryProfileUseCase {
  constructor(
    @Inject(DOMICILIARY_PROFILE_REPOSITORY)
    private readonly repo: DomiciliaryProfileRepositoryPort,
    private readonly events: EventEmitter2,
  ) {}

  async execute(cmd: CreateDomiciliaryProfileCommand): Promise<{ profileId: string }> {
    if (await this.repo.findByUserId(cmd.userId, cmd.tenantId)) {
      throw new DomiciliaryUserAlreadyRegisteredError();
    }
    const now = new Date();
    const id = randomUUID();
    const p = new DomiciliaryProfile(
      id,
      cmd.tenantId,
      cmd.userId,
      cmd.fullName.trim(),
      cmd.phone.trim(),
      cmd.documentId.trim(),
      cmd.linkedExternalVehicleId ?? null,
      true,
      now,
      now,
    );
    await this.repo.save(p);
    this.events.emit(CalypsoEvents.DOMICILIARY_CREATED, {
      tenantId: cmd.tenantId,
      performedByUserId: null,
      profileId: id,
      userId: cmd.userId,
    });
    return { profileId: id };
  }
}
