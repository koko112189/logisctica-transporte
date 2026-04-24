import { Inject, Injectable } from '@nestjs/common';
import { ExternalCarrier } from '../../../domain/entities/external-carrier.entity';
import { ExternalCarrierNotFoundError } from '../../../domain/errors/carrier.errors';
import type { ExternalCarrierRepositoryPort } from '../../../domain/ports/external-carrier.repository.port';
import { EXTERNAL_CARRIER_REPOSITORY } from '../../../carriers.di-tokens';
import { UpdateExternalCarrierCommand } from './update-external-carrier.command';

@Injectable()
export class UpdateExternalCarrierUseCase {
  constructor(
    @Inject(EXTERNAL_CARRIER_REPOSITORY)
    private readonly carriers: ExternalCarrierRepositoryPort,
  ) {}

  async execute(cmd: UpdateExternalCarrierCommand): Promise<void> {
    const existing = await this.carriers.findById(cmd.id, cmd.tenantId);
    if (!existing) throw new ExternalCarrierNotFoundError();
    const now = new Date();
    const updated = new ExternalCarrier(
      existing.id,
      existing.tenantId,
      existing.legalName,
      existing.taxId,
      cmd.contactName !== undefined ? cmd.contactName.trim() : existing.contactName,
      cmd.contactEmail !== undefined ? cmd.contactEmail.trim().toLowerCase() : existing.contactEmail,
      cmd.phone !== undefined ? cmd.phone.trim() : existing.phone,
      cmd.notes !== undefined ? cmd.notes.trim() : existing.notes,
      cmd.isActive !== undefined ? cmd.isActive : existing.isActive,
      existing.createdAt,
      now,
    );
    await this.carriers.save(updated);
  }
}
