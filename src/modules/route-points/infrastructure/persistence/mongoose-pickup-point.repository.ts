import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { CoordinatesVO } from '../../../../shared/domain/value-objects/coordinates.vo';
import { PickupPoint } from '../../domain/entities/pickup-point.entity';
import type { PickupPointFilters, PickupPointRepositoryPort } from '../../domain/ports/pickup-point.repository.port';
import { PickupPointSchemaClass } from './pickup-point.schema';

type LeanPoint = {
  _id: { toString(): string };
  tenantId: string;
  name: string;
  type: string;
  address: string;
  city: string;
  postalCode: string | null;
  coordinates: { lat: number; lng: number } | null;
  contactName: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  operatingHours: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MongoosePickupPointRepository implements PickupPointRepositoryPort {
  constructor(
    @InjectModel(PickupPointSchemaClass.name)
    private readonly model: Model<PickupPointSchemaClass>,
  ) {}

  async save(point: PickupPoint): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: point.id },
      {
        $set: {
          tenantId: point.tenantId,
          name: point.name,
          type: point.type,
          address: point.address,
          city: point.city,
          postalCode: point.postalCode,
          coordinates: point.coordinates
            ? { lat: point.coordinates.lat, lng: point.coordinates.lng }
            : null,
          contactName: point.contactName,
          contactPhone: point.contactPhone,
          contactEmail: point.contactEmail,
          operatingHours: point.operatingHours,
          isActive: point.isActive,
          createdAt: point.createdAt,
          updatedAt: point.updatedAt,
        },
      },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<PickupPoint | null> {
    const doc = await this.model.findOne({ _id: id, tenantId }).lean<LeanPoint>();
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(
    tenantId: string,
    filters: PickupPointFilters,
    page: number,
    limit: number,
  ): Promise<{ items: PickupPoint[]; total: number }> {
    const query: Record<string, unknown> = { tenantId };
    if (filters.type !== undefined) query['type'] = filters.type;
    if (filters.city !== undefined) query['city'] = filters.city;
    if (filters.isActive !== undefined) query['isActive'] = filters.isActive;

    const [docs, total] = await Promise.all([
      this.model
        .find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<LeanPoint[]>(),
      this.model.countDocuments(query),
    ]);
    return { items: docs.map((d) => this.toDomain(d)), total };
  }

  private toDomain(doc: LeanPoint): PickupPoint {
    return new PickupPoint(
      doc._id.toString(),
      doc.tenantId,
      doc.name,
      doc.type as PickupPoint['type'],
      doc.address,
      doc.city,
      doc.postalCode,
      doc.coordinates ? new CoordinatesVO(doc.coordinates.lat, doc.coordinates.lng) : null,
      doc.contactName,
      doc.contactPhone,
      doc.contactEmail,
      doc.operatingHours,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
