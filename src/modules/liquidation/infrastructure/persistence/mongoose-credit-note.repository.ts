import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { CreditNote } from '../../domain/entities/credit-note.entity';
import { CreditNoteItem } from '../../domain/value-objects/credit-note-item.vo';
import type { CreditNoteRepositoryPort } from '../../domain/ports/credit-note.repository.port';
import { CreditNoteSchemaClass } from './credit-note.schema';

type LeanItem = { description: string; quantity: number; unitValue: number; totalValue: number };
type LeanNote = { _id: { toString(): string }; tenantId: string; tripId: string; storeDeliveryId: string; number: string; reason: string; items: LeanItem[]; totalAmount: number; issuedAt: Date | null; status: string; createdAt: Date };

@Injectable()
export class MongooseCreditNoteRepository implements CreditNoteRepositoryPort {
  constructor(
    @InjectModel(CreditNoteSchemaClass.name)
    private readonly model: Model<CreditNoteSchemaClass>,
  ) {}

  async save(note: CreditNote): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: note.id },
      { $set: { tenantId: note.tenantId, tripId: note.tripId, storeDeliveryId: note.storeDeliveryId, number: note.number, reason: note.reason, items: note.items, totalAmount: note.totalAmount, issuedAt: note.issuedAt, status: note.status, createdAt: note.createdAt } },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<CreditNote | null> {
    const doc = await this.model.findOne({ _id: id, tenantId }).lean<LeanNote>();
    return doc ? this.toDomain(doc) : null;
  }

  async findByDelivery(storeDeliveryId: string, tenantId: string): Promise<CreditNote | null> {
    const doc = await this.model.findOne({ storeDeliveryId, tenantId }).lean<LeanNote>();
    return doc ? this.toDomain(doc) : null;
  }

  async nextNumber(tenantId: string): Promise<string> {
    const count = await this.model.countDocuments({ tenantId });
    return `NC-${String(count + 1).padStart(6, '0')}`;
  }

  private toDomain(doc: LeanNote): CreditNote {
    return new CreditNote(
      doc._id.toString(), doc.tenantId, doc.tripId, doc.storeDeliveryId,
      doc.number, doc.reason,
      doc.items.map((i) => new CreditNoteItem(i.description, i.quantity, i.unitValue, i.totalValue)),
      doc.totalAmount, doc.issuedAt, doc.status as CreditNote['status'], doc.createdAt,
    );
  }
}
