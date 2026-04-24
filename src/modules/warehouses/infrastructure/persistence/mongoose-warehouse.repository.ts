import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoordinatesVO } from '../../../../shared/domain/value-objects/coordinates.vo';
import { Warehouse } from '../../domain/entities/warehouse.entity';
import { WarehouseRepositoryPort } from '../../domain/ports/warehouse.repository.port';
import { WarehouseSchemaClass } from './warehouse.schema';

@Injectable()
export class MongooseWarehouseRepository implements WarehouseRepositoryPort {
  constructor(
    @InjectModel(WarehouseSchemaClass.name)
    private readonly model: Model<WarehouseSchemaClass>,
  ) {}

  async save(w: Warehouse): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: w.id },
      {
        $set: {
          tenantId: w.tenantId,
          name: w.name,
          address: w.address,
          city: w.city,
          notificationEmail: w.notificationEmail,
          phone: w.phone,
          coordinates: w.coordinates
            ? { lat: w.coordinates.lat, lng: w.coordinates.lng }
            : null,
          alertOnTripDispatch: w.alertOnTripDispatch,
          isActive: w.isActive,
          createdAt: w.createdAt,
          updatedAt: w.updatedAt,
        },
      },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<Warehouse | null> {
    const d = await this.model.findOne({ _id: id, tenantId }).lean<WarehouseSchemaClass | null>();
    return d ? this.to(d) : null;
  }

  async list(
    tenantId: string,
    page: number,
    limit: number,
    activeOnly: boolean,
  ): Promise<{ items: Warehouse[]; total: number }> {
    const q: Record<string, unknown> = { tenantId };
    if (activeOnly) q['isActive'] = true;
    const [docs, total] = await Promise.all([
      this.model
        .find(q)
        .sort({ name: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<WarehouseSchemaClass[]>(),
      this.model.countDocuments(q),
    ]);
    return { items: docs.map((d) => this.to(d)), total };
  }

  private to(d: WarehouseSchemaClass): Warehouse {
    return new Warehouse(
      d._id,
      d.tenantId,
      d.name,
      d.address,
      d.city,
      d.notificationEmail,
      d.phone,
      d.coordinates ? new CoordinatesVO(d.coordinates.lat, d.coordinates.lng) : null,
      d.alertOnTripDispatch,
      d.isActive,
      d.createdAt,
      d.updatedAt,
    );
  }
}
