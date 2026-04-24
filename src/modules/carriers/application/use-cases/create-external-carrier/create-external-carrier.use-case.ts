import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'node:crypto';
import { CalypsoEvents } from '../../../../../shared/events/calypso-events';
import { ExternalCarrier } from '../../../domain/entities/external-carrier.entity';
import { ExternalTaxIdExistsError } from '../../../domain/errors/carrier.errors';
import type { ExternalCarrierRepositoryPort } from '../../../domain/ports/external-carrier.repository.port';
import { EXTERNAL_CARRIER_REPOSITORY } from '../../../carriers.di-tokens';
import { CreateExternalCarrierCommand } from './create-external-carrier.command';

@Injectable()
export class CreateExternalCarrierUseCase {
  constructor(
    @Inject(EXTERNAL_CARRIER_REPOSITORY)
    private readonly carriers: ExternalCarrierRepositoryPort,
    private readonly events: EventEmitter2,
  ) {}

  async execute(cmd: CreateExternalCarrierCommand): Promise<{ carrierId: string }> {
    const tax = cmd.taxId.trim();
    if (await this.carriers.findByTaxId(tax, cmd.tenantId)) {
      throw new ExternalTaxIdExistsError(tax);
    }
    const now = new Date();
    const id = randomUUID();
    const c = new ExternalCarrier(
      id,
      cmd.tenantId,
      cmd.legalName.trim(),
      tax,
      cmd.contactName.trim(),
      cmd.contactEmail.trim().toLowerCase(),
      cmd.phone.trim(),
      cmd.notes.trim(),
      true,
      now,
      now,
    );
    await this.carriers.save(c);
    this.events.emit(CalypsoEvents.CARRIER_CREATED, {
      tenantId: cmd.tenantId,
      performedByUserId: null,
      carrierId: id,
      taxId: tax,
    });
    return { carrierId: id };
  }
}
