import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { StoreDelivery } from '../../domain/entities/store-delivery.entity';
import { SupplyItem } from '../../domain/value-objects/supply-item.vo';
import type { StoreDeliveryRepositoryPort } from '../../domain/ports/store-delivery.repository.port';
import { StoreDeliverySchemaClass } from './store-delivery.schema';

type LeanSupply = { name: string; quantity: number; unit: string; unitValue: number; totalValue: number };
type LeanDelivery = { _id: { toString(): string }; tenantId: string; tripId: string; tripStopOrder: number; pickupPointId: string; supplies: LeanSupply[]; merchandiseValue: number; creditNoteId: string | null; status: string; observations: string; deliveredAt: Date | null; receivedByName: string | null; createdAt: Date; updatedAt: Date };

@Injectable()
export class MongooseStoreDeliveryRepository implements StoreDeliveryRepositoryPort {
  constructor(
    @InjectModel(StoreDeliverySchemaClass.name)
    private readonly model: Model<StoreDeliverySchemaClass>,
  ) {}

  async save(delivery: StoreDelivery): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: delivery.id },
      { $set: { tenantId: delivery.tenantId, tripId: delivery.tripId, tripStopOrder: delivery.tripStopOrder, pickupPointId: delivery.pickupPointId, supplies: delivery.supplies, merchandiseValue: delivery.merchandiseValue, creditNoteId: delivery.creditNoteId, status: delivery.status, observations: delivery.observations, deliveredAt: delivery.deliveredAt, receivedByName: delivery.receivedByName, createdAt: delivery.createdAt, updatedAt: delivery.updatedAt } },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<StoreDelivery | null> {
    const doc = await this.model.findOne({ _id: id, tenantId }).lean<LeanDelivery>();
    return doc ? this.toDomain(doc) : null;
  }

  async findByTrip(tripId: string, tenantId: string): Promise<StoreDelivery[]> {
    const docs = await this.model.find({ tripId, tenantId }).lean<LeanDelivery[]>();
    return docs.map((d) => this.toDomain(d));
  }

  private toDomain(doc: LeanDelivery): StoreDelivery {
    return new StoreDelivery(
      doc._id.toString(), doc.tenantId, doc.tripId, doc.tripStopOrder, doc.pickupPointId,
      doc.supplies.map((s) => new SupplyItem(s.name, s.quantity, s.unit, s.unitValue, s.totalValue)),
      doc.merchandiseValue, doc.creditNoteId, doc.status as StoreDelivery['status'],
      doc.observations, doc.deliveredAt, doc.receivedByName, doc.createdAt, doc.updatedAt,
    );
  }
}
