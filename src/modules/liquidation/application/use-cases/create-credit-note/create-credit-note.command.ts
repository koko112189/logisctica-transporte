import type { CreditNoteItem } from '../../../domain/value-objects/credit-note-item.vo';

export class CreateCreditNoteCommand {
  constructor(
    public readonly tenantId: string,
    public readonly tripId: string,
    public readonly storeDeliveryId: string,
    public readonly reason: string,
    public readonly items: CreditNoteItem[],
  ) {}
}
