import { Inject, Injectable } from '@nestjs/common';
import { CreditNoteNotFoundError } from '../../../domain/errors/liquidation.errors';
import type { CreditNoteRepositoryPort } from '../../../domain/ports/credit-note.repository.port';
import { CREDIT_NOTE_REPOSITORY } from '../../../liquidation.di-tokens';
import { IssueCreditNoteCommand } from './issue-credit-note.command';

@Injectable()
export class IssueCreditNoteUseCase {
  constructor(
    @Inject(CREDIT_NOTE_REPOSITORY)
    private readonly notes: CreditNoteRepositoryPort,
  ) {}

  async execute(command: IssueCreditNoteCommand): Promise<void> {
    const note = await this.notes.findById(command.creditNoteId, command.tenantId);
    if (!note) throw new CreditNoteNotFoundError(command.creditNoteId);
    await this.notes.save(note.issue(new Date()));
  }
}
