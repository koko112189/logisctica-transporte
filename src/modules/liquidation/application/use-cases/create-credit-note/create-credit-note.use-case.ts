import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreditNote } from '../../../domain/entities/credit-note.entity';
import { CreditNoteStatus } from '../../../domain/enums/credit-note-status.enum';
import type { CreditNoteRepositoryPort } from '../../../domain/ports/credit-note.repository.port';
import type { StoreDeliveryRepositoryPort } from '../../../domain/ports/store-delivery.repository.port';
import { CREDIT_NOTE_REPOSITORY, STORE_DELIVERY_REPOSITORY } from '../../../liquidation.di-tokens';
import { CreateCreditNoteCommand } from './create-credit-note.command';
import { StoreDeliveryNotFoundError } from '../../../domain/errors/liquidation.errors';

@Injectable()
export class CreateCreditNoteUseCase {
  constructor(
    @Inject(CREDIT_NOTE_REPOSITORY)
    private readonly notes: CreditNoteRepositoryPort,
    @Inject(STORE_DELIVERY_REPOSITORY)
    private readonly deliveries: StoreDeliveryRepositoryPort,
  ) {}

  async execute(command: CreateCreditNoteCommand): Promise<{ creditNoteId: string }> {
    const delivery = await this.deliveries.findById(command.storeDeliveryId, command.tenantId);
    if (!delivery) throw new StoreDeliveryNotFoundError(command.storeDeliveryId);

    const number = await this.notes.nextNumber(command.tenantId);
    const total = command.items.reduce((sum, i) => sum + i.totalValue, 0);
    const now = new Date();

    const note = new CreditNote(
      randomUUID(),
      command.tenantId,
      command.tripId,
      command.storeDeliveryId,
      number,
      command.reason,
      command.items,
      total,
      null,
      CreditNoteStatus.DRAFT,
      now,
    );
    await this.notes.save(note);
    await this.deliveries.save(delivery.linkCreditNote(note.id));
    return { creditNoteId: note.id };
  }
}
