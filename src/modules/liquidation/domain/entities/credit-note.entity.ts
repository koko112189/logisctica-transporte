import { CreditNoteStatus } from '../enums/credit-note-status.enum';
import type { CreditNoteItem } from '../value-objects/credit-note-item.vo';

export class CreditNote {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly tripId: string,
    public readonly storeDeliveryId: string,
    public readonly number: string,
    public readonly reason: string,
    public readonly items: CreditNoteItem[],
    public readonly totalAmount: number,
    public readonly issuedAt: Date | null,
    public readonly status: CreditNoteStatus,
    public readonly createdAt: Date,
  ) {}

  issue(now: Date): CreditNote {
    return new CreditNote(
      this.id, this.tenantId, this.tripId, this.storeDeliveryId,
      this.number, this.reason, this.items, this.totalAmount,
      now, CreditNoteStatus.ISSUED, this.createdAt,
    );
  }

  cancel(): CreditNote {
    return new CreditNote(
      this.id, this.tenantId, this.tripId, this.storeDeliveryId,
      this.number, this.reason, this.items, this.totalAmount,
      this.issuedAt, CreditNoteStatus.CANCELLED, this.createdAt,
    );
  }
}
