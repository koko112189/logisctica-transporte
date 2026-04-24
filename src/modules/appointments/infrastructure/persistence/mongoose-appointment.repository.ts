import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoordinatesVO } from '../../../../shared/domain/value-objects/coordinates.vo';
import { LocationVO } from '../../../../shared/domain/value-objects/location.vo';
import { Appointment } from '../../domain/entities/appointment.entity';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';
import type {
  AppointmentFilters,
  AppointmentRepositoryPort,
} from '../../domain/ports/appointment.repository.port';
import { AppointmentSchemaClass, type AppointmentDocument } from './appointment.schema';

type LeanLoc = { address: string; city: string; lat: number | null; lng: number | null };
type LeanAppointment = {
  _id: string; tenantId: string; vehicleId: string; driverId: string;
  title: string; description: string; origin: LeanLoc; destination: LeanLoc;
  scheduledAt: Date; estimatedDurationMinutes: number;
  status: AppointmentStatus; notificationSentAt: Date | null;
  createdAt: Date; updatedAt: Date;
};

@Injectable()
export class MongooseAppointmentRepository implements AppointmentRepositoryPort {
  constructor(
    @InjectModel(AppointmentSchemaClass.name)
    private readonly model: Model<AppointmentDocument>,
  ) {}

  async save(appt: Appointment): Promise<void> {
    const toSchemaLoc = (l: LocationVO) => ({
      address: l.address,
      city: l.city,
      lat: l.coordinates?.lat ?? null,
      lng: l.coordinates?.lng ?? null,
    });
    await this.model.findOneAndUpdate(
      { _id: appt.id },
      {
        _id: appt.id, tenantId: appt.tenantId,
        vehicleId: appt.vehicleId, driverId: appt.driverId,
        title: appt.title, description: appt.description,
        origin: toSchemaLoc(appt.origin),
        destination: toSchemaLoc(appt.destination),
        scheduledAt: appt.scheduledAt,
        estimatedDurationMinutes: appt.estimatedDurationMinutes,
        status: appt.status,
        notificationSentAt: appt.notificationSentAt,
        createdAt: appt.createdAt,
        updatedAt: appt.updatedAt,
      },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<Appointment | null> {
    const doc = await this.model.findOne({ _id: id, tenantId }).lean<LeanAppointment>();
    return doc ? this.toDomain(doc) : null;
  }

  async list(tenantId: string, filters: AppointmentFilters, skip: number, limit: number): Promise<{ items: Appointment[]; total: number }> {
    const filter: Record<string, unknown> = { tenantId };
    if (filters.vehicleId) filter['vehicleId'] = filters.vehicleId;
    if (filters.driverId) filter['driverId'] = filters.driverId;
    if (filters.status) filter['status'] = filters.status;
    if (filters.from || filters.to) {
      const dateFilter: Record<string, Date> = {};
      if (filters.from) dateFilter['$gte'] = filters.from;
      if (filters.to) dateFilter['$lte'] = filters.to;
      filter['scheduledAt'] = dateFilter;
    }
    const [docs, total] = await Promise.all([
      this.model.find(filter).sort({ scheduledAt: 1 }).skip(skip).limit(limit).lean<LeanAppointment[]>(),
      this.model.countDocuments(filter),
    ]);
    return { items: docs.map((d) => this.toDomain(d)), total };
  }

  async findUpcomingByDriver(driverId: string, tenantId: string, from: Date): Promise<Appointment[]> {
    const docs = await this.model
      .find({
        driverId, tenantId,
        scheduledAt: { $gte: from },
        status: { $in: [AppointmentStatus.SCHEDULED, AppointmentStatus.IN_PROGRESS] },
      })
      .sort({ scheduledAt: 1 })
      .limit(10)
      .lean<LeanAppointment[]>();
    return docs.map((d) => this.toDomain(d));
  }

  private toLocationVO(l: LeanLoc): LocationVO {
    return new LocationVO(
      l.address, l.city,
      l.lat != null && l.lng != null ? new CoordinatesVO(l.lat, l.lng) : null,
    );
  }

  private toDomain(doc: LeanAppointment): Appointment {
    return new Appointment(
      doc._id, doc.tenantId, doc.vehicleId, doc.driverId,
      doc.title, doc.description ?? '',
      this.toLocationVO(doc.origin),
      this.toLocationVO(doc.destination),
      doc.scheduledAt, doc.estimatedDurationMinutes,
      doc.status, doc.notificationSentAt ?? null,
      doc.createdAt, doc.updatedAt,
    );
  }
}
