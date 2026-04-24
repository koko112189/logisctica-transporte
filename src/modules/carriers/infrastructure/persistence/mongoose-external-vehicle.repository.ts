import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExternalVehicle } from '../../domain/entities/external-vehicle.entity';
import { LightVehicleKind } from '../../domain/enums/light-vehicle-kind.enum';
import { ExternalVehicleRepositoryPort } from '../../domain/ports/external-vehicle.repository.port';
import { ExternalVehicleSchemaClass } from './external-vehicle.schema';

@Injectable()
export class MongooseExternalVehicleRepository implements ExternalVehicleRepositoryPort {
  constructor(
    @InjectModel(ExternalVehicleSchemaClass.name)
    private readonly model: Model<ExternalVehicleSchemaClass>,
  ) {}

  async save(vehicle: ExternalVehicle): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: vehicle.id },
      {
        $set: {
          tenantId: vehicle.tenantId,
          carrierId: vehicle.carrierId,
          licensePlate: vehicle.licensePlate,
          kind: vehicle.kind,
          label: vehicle.label,
          capacityKg: vehicle.capacityKg,
          isActive: vehicle.isActive,
          notes: vehicle.notes,
          createdAt: vehicle.createdAt,
          updatedAt: vehicle.updatedAt,
        },
      },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<ExternalVehicle | null> {
    const doc = await this.model.findOne({ _id: id, tenantId }).lean<ExternalVehicleSchemaClass | null>();
    return doc ? this.toDomain(doc) : null;
  }

  async listByCarrier(
    carrierId: string,
    tenantId: string,
    page: number,
    limit: number,
  ): Promise<{ items: ExternalVehicle[]; total: number }> {
    const q = { carrierId, tenantId };
    const [docs, total] = await Promise.all([
      this.model
        .find(q)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<ExternalVehicleSchemaClass[]>(),
      this.model.countDocuments(q),
    ]);
    return { items: docs.map((d) => this.toDomain(d)), total };
  }

  async findByPlate(plate: string, tenantId: string): Promise<ExternalVehicle | null> {
    const p = plate.toUpperCase().trim();
    const doc = await this.model.findOne({ licensePlate: p, tenantId }).lean<ExternalVehicleSchemaClass | null>();
    return doc ? this.toDomain(doc) : null;
  }

  private toDomain(d: ExternalVehicleSchemaClass): ExternalVehicle {
    return new ExternalVehicle(
      d._id,
      d.tenantId,
      d.carrierId,
      d.licensePlate,
      d.kind as LightVehicleKind,
      d.label,
      d.capacityKg,
      d.isActive,
      d.notes,
      d.createdAt,
      d.updatedAt,
    );
  }
}
