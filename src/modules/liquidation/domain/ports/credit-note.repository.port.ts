import type { CreditNote } from '../entities/credit-note.entity';

export interface CreditNoteRepositoryPort {
  save(note: CreditNote): Promise<void>;
  findById(id: string, tenantId: string): Promise<CreditNote | null>;
  findByDelivery(storeDeliveryId: string, tenantId: string): Promise<CreditNote | null>;
  nextNumber(tenantId: string): Promise<string>;
}
