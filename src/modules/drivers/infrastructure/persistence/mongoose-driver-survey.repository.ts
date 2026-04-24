import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { DriverSurvey } from '../../domain/entities/driver-survey.entity';
import { DeliveredItem } from '../../domain/value-objects/delivered-item.vo';
import { Incident } from '../../domain/value-objects/incident.vo';
import type { SurveyFilters, DriverSurveyRepositoryPort } from '../../domain/ports/driver-survey.repository.port';
import { SurveyStatus } from '../../domain/enums/survey-status.enum';
import { DriverSurveySchemaClass } from './driver-survey.schema';

type LeanItem = { name: string; quantity: number; unit: string | null; confirmed: boolean; observations: string | null };
type LeanIncident = { type: string; description: string; severity: string };
type LeanSurvey = { _id: { toString(): string }; tenantId: string; driverId: string; vehicleId: string; date: string; vehicleState: string | null; deliveredItems: LeanItem[]; incidents: LeanIncident[]; chemicalsHandled: boolean; chemicalsDelivered: boolean | null; observations: string; status: string; submittedAt: Date | null; createdAt: Date };

@Injectable()
export class MongooseDriverSurveyRepository implements DriverSurveyRepositoryPort {
  constructor(
    @InjectModel(DriverSurveySchemaClass.name)
    private readonly model: Model<DriverSurveySchemaClass>,
  ) {}

  async save(survey: DriverSurvey): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: survey.id },
      {
        $set: {
          tenantId: survey.tenantId,
          driverId: survey.driverId,
          vehicleId: survey.vehicleId,
          date: survey.date,
          vehicleState: survey.vehicleState,
          deliveredItems: survey.deliveredItems.map((i) => ({ name: i.name, quantity: i.quantity, unit: i.unit, confirmed: i.confirmed, observations: i.observations })),
          incidents: survey.incidents.map((i) => ({ type: i.type, description: i.description, severity: i.severity })),
          chemicalsHandled: survey.chemicalsHandled,
          chemicalsDelivered: survey.chemicalsDelivered,
          observations: survey.observations,
          status: survey.status,
          submittedAt: survey.submittedAt,
          createdAt: survey.createdAt,
        },
      },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<DriverSurvey | null> {
    const doc = await this.model.findOne({ _id: id, tenantId }).lean<LeanSurvey>();
    return doc ? this.toDomain(doc) : null;
  }

  async findPendingByDriver(driverId: string, tenantId: string): Promise<DriverSurvey[]> {
    const docs = await this.model.find({ driverId, tenantId, status: SurveyStatus.PENDING }).lean<LeanSurvey[]>();
    return docs.map((d) => this.toDomain(d));
  }

  async findAll(tenantId: string, filters: SurveyFilters, page: number, limit: number): Promise<{ items: DriverSurvey[]; total: number }> {
    const q: Record<string, unknown> = { tenantId };
    if (filters.driverId) q['driverId'] = filters.driverId;
    if (filters.status) q['status'] = filters.status;
    if (filters.from || filters.to) {
      const range: Record<string, string> = {};
      if (filters.from) range['$gte'] = filters.from;
      if (filters.to) range['$lte'] = filters.to;
      q['date'] = range;
    }
    const [docs, total] = await Promise.all([
      this.model.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean<LeanSurvey[]>(),
      this.model.countDocuments(q),
    ]);
    return { items: docs.map((d) => this.toDomain(d)), total };
  }

  private toDomain(doc: LeanSurvey): DriverSurvey {
    return new DriverSurvey(
      doc._id.toString(), doc.tenantId, doc.driverId, doc.vehicleId, doc.date,
      doc.vehicleState as DriverSurvey['vehicleState'],
      doc.deliveredItems.map((i) => new DeliveredItem(i.name, i.quantity, i.unit, i.confirmed, i.observations)),
      doc.incidents.map((i) => new Incident(i.type as Incident['type'], i.description, i.severity as Incident['severity'])),
      doc.chemicalsHandled, doc.chemicalsDelivered, doc.observations,
      doc.status as DriverSurvey['status'], doc.submittedAt, doc.createdAt,
    );
  }
}
