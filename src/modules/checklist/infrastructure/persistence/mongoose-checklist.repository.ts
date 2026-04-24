import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyChecklist } from '../../domain/entities/daily-checklist.entity';
import { ChecklistCategory } from '../../domain/enums/checklist-category.enum';
import { ChecklistStatus } from '../../domain/enums/checklist-status.enum';
import { ChecklistTemplate } from '../../domain/enums/checklist-template.enum';
import { FuelLevel } from '../../domain/enums/fuel-level.enum';
import { ItemStatus } from '../../domain/enums/item-status.enum';
import { ChecklistItem } from '../../domain/value-objects/checklist-item.vo';
import type {
  ChecklistFilters,
  ChecklistRepositoryPort,
} from '../../domain/ports/checklist.repository.port';
import { ChecklistSchemaClass, type ChecklistDocument } from './checklist.schema';

type LeanItem = { category: ChecklistCategory; name: string; status: ItemStatus; observation: string | null };
type LeanChecklist = {
  _id: string; tenantId: string; vehicleId: string; driverId: string; date: string;
  items: LeanItem[]; fuelLevel: FuelLevel | null; previousTasksConfirmed: boolean;
  generalObservations: string; checklistTemplate: ChecklistTemplate;
  status: ChecklistStatus; submittedAt: Date | null; createdAt: Date;
};

@Injectable()
export class MongooseChecklistRepository implements ChecklistRepositoryPort {
  constructor(
    @InjectModel(ChecklistSchemaClass.name)
    private readonly model: Model<ChecklistDocument>,
  ) {}

  async save(checklist: DailyChecklist): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: checklist.id },
      {
        _id: checklist.id,
        tenantId: checklist.tenantId,
        vehicleId: checklist.vehicleId,
        driverId: checklist.driverId,
        date: checklist.date,
        items: checklist.items.map((i) => ({
          category: i.category,
          name: i.name,
          status: i.status,
          observation: i.observation,
        })),
        fuelLevel: checklist.fuelLevel,
        previousTasksConfirmed: checklist.previousTasksConfirmed,
        generalObservations: checklist.generalObservations,
        checklistTemplate: checklist.checklistTemplate,
        status: checklist.status,
        submittedAt: checklist.submittedAt,
        createdAt: checklist.createdAt,
      },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<DailyChecklist | null> {
    const doc = await this.model.findOne({ _id: id, tenantId }).lean<LeanChecklist>();
    return doc ? this.toDomain(doc) : null;
  }

  async findByVehicleAndDate(vehicleId: string, tenantId: string, date: string): Promise<DailyChecklist | null> {
    const doc = await this.model.findOne({ vehicleId, tenantId, date }).lean<LeanChecklist>();
    return doc ? this.toDomain(doc) : null;
  }

  async findPendingByDriver(driverId: string, tenantId: string): Promise<DailyChecklist[]> {
    const docs = await this.model
      .find({ driverId, tenantId, status: ChecklistStatus.PENDING })
      .sort({ date: -1 })
      .lean<LeanChecklist[]>();
    return docs.map((d) => this.toDomain(d));
  }

  async list(tenantId: string, filters: ChecklistFilters, skip: number, limit: number): Promise<{ items: DailyChecklist[]; total: number }> {
    const filter: Record<string, unknown> = { tenantId };
    if (filters.vehicleId) filter['vehicleId'] = filters.vehicleId;
    if (filters.driverId) filter['driverId'] = filters.driverId;
    if (filters.status) filter['status'] = filters.status;
    if (filters.dateFrom || filters.dateTo) {
      const dateFilter: Record<string, string> = {};
      if (filters.dateFrom) dateFilter['$gte'] = filters.dateFrom;
      if (filters.dateTo) dateFilter['$lte'] = filters.dateTo;
      filter['date'] = dateFilter;
    }
    const [docs, total] = await Promise.all([
      this.model.find(filter).sort({ date: -1 }).skip(skip).limit(limit).lean<LeanChecklist[]>(),
      this.model.countDocuments(filter),
    ]);
    return { items: docs.map((d) => this.toDomain(d)), total };
  }

  private toDomain(doc: LeanChecklist): DailyChecklist {
    return new DailyChecklist(
      doc._id, doc.tenantId, doc.vehicleId, doc.driverId, doc.date,
      (doc.items ?? []).map((i) => new ChecklistItem(i.category, i.name, i.status, i.observation)),
      doc.fuelLevel ?? null,
      doc.previousTasksConfirmed,
      doc.generalObservations ?? '',
      doc.checklistTemplate,
      doc.status,
      doc.submittedAt ?? null,
      doc.createdAt,
    );
  }
}
