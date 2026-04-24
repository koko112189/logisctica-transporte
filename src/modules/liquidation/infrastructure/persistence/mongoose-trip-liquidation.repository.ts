import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { TripLiquidation } from '../../domain/entities/trip-liquidation.entity';
import { Expense } from '../../domain/value-objects/expense.vo';
import { Commission } from '../../domain/value-objects/commission.vo';
import type { TripLiquidationRepositoryPort } from '../../domain/ports/trip-liquidation.repository.port';
import { TripLiquidationSchemaClass } from './trip-liquidation.schema';

type LeanExpense = { type: string; description: string; amount: number; receiptUrl: string | null };
type LeanComm = { description: string; amount: number };
type LeanLiq = { _id: { toString(): string }; tenantId: string; tripId: string; totalMerchandiseValue: number; travelExpenses: LeanExpense[]; driverCommission: number; otherCommissions: LeanComm[]; status: string; approvedByUserId: string | null; approvedAt: Date | null; createdAt: Date; updatedAt: Date };

@Injectable()
export class MongooseTripLiquidationRepository implements TripLiquidationRepositoryPort {
  constructor(
    @InjectModel(TripLiquidationSchemaClass.name)
    private readonly model: Model<TripLiquidationSchemaClass>,
  ) {}

  async save(liq: TripLiquidation): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: liq.id },
      { $set: { tenantId: liq.tenantId, tripId: liq.tripId, totalMerchandiseValue: liq.totalMerchandiseValue, travelExpenses: liq.travelExpenses, driverCommission: liq.driverCommission, otherCommissions: liq.otherCommissions, status: liq.status, approvedByUserId: liq.approvedByUserId, approvedAt: liq.approvedAt, createdAt: liq.createdAt, updatedAt: liq.updatedAt } },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<TripLiquidation | null> {
    const doc = await this.model.findOne({ _id: id, tenantId }).lean<LeanLiq>();
    return doc ? this.toDomain(doc) : null;
  }

  async findByTrip(tripId: string, tenantId: string): Promise<TripLiquidation | null> {
    const doc = await this.model.findOne({ tripId, tenantId }).lean<LeanLiq>();
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(tenantId: string, page: number, limit: number): Promise<{ items: TripLiquidation[]; total: number }> {
    const [docs, total] = await Promise.all([
      this.model.find({ tenantId }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean<LeanLiq[]>(),
      this.model.countDocuments({ tenantId }),
    ]);
    return { items: docs.map((d) => this.toDomain(d)), total };
  }

  private toDomain(doc: LeanLiq): TripLiquidation {
    return new TripLiquidation(
      doc._id.toString(), doc.tenantId, doc.tripId, doc.totalMerchandiseValue,
      doc.travelExpenses.map((e) => new Expense(e.type as Expense['type'], e.description, e.amount, e.receiptUrl)),
      doc.driverCommission,
      doc.otherCommissions.map((c) => new Commission(c.description, c.amount)),
      doc.status as TripLiquidation['status'],
      doc.approvedByUserId, doc.approvedAt, doc.createdAt, doc.updatedAt,
    );
  }
}
