import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { DefectStatus } from '../../domain/enums/defect-status.enum';
import { VehicleStatus } from '../../domain/enums/vehicle-status.enum';
import { VehicleType } from '../../domain/enums/vehicle-type.enum';
import { Defect } from '../../domain/value-objects/defect.vo';
import { Repair } from '../../domain/value-objects/repair.vo';
import type {
  VehicleFilters,
  VehicleRepositoryPort,
} from '../../domain/ports/vehicle.repository.port';
import { VehicleSchemaClass, type VehicleDocument } from './vehicle.schema';

type LeanDefect = {
  id: string;
  description: string;
  reportedAt: Date;
  resolvedAt: Date | null;
  status: DefectStatus;
};

type LeanRepair = {
  id: string;
  description: string;
  date: Date;
  cost: number | null;
  mechanic: string | null;
  notes: string | null;
};

type LeanVehicle = {
  _id: string;
  tenantId: string;
  licensePlate: string;
  vehicleType: VehicleType;
  brand: string;
  model: string;
  year: number;
  capacity: number;
  defects: LeanDefect[];
  repairs: LeanRepair[];
  observations: string;
  linkedDriverId: string | null;
  status: VehicleStatus;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MongooseVehicleRepository implements VehicleRepositoryPort {
  constructor(
    @InjectModel(VehicleSchemaClass.name)
    private readonly model: Model<VehicleDocument>,
  ) {}

  async save(vehicle: Vehicle): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: vehicle.id },
      {
        _id: vehicle.id,
        tenantId: vehicle.tenantId,
        licensePlate: vehicle.licensePlate,
        vehicleType: vehicle.vehicleType,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        capacity: vehicle.capacity,
        defects: vehicle.defects.map((d) => ({
          id: d.id,
          description: d.description,
          reportedAt: d.reportedAt,
          resolvedAt: d.resolvedAt,
          status: d.status,
        })),
        repairs: vehicle.repairs.map((r) => ({
          id: r.id,
          description: r.description,
          date: r.date,
          cost: r.cost,
          mechanic: r.mechanic,
          notes: r.notes,
        })),
        observations: vehicle.observations,
        linkedDriverId: vehicle.linkedDriverId,
        status: vehicle.status,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
      },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<Vehicle | null> {
    const doc = await this.model
      .findOne({ _id: id, tenantId })
      .lean<LeanVehicle>();
    return doc ? this.toDomain(doc) : null;
  }

  async findByLicensePlate(
    licensePlate: string,
    tenantId: string,
  ): Promise<Vehicle | null> {
    const doc = await this.model
      .findOne({ licensePlate, tenantId })
      .lean<LeanVehicle>();
    return doc ? this.toDomain(doc) : null;
  }

  async list(
    tenantId: string,
    filters: VehicleFilters,
    skip: number,
    limit: number,
  ): Promise<{ items: Vehicle[]; total: number }> {
    const filter: Record<string, unknown> = { tenantId };
    if (filters.vehicleType) filter['vehicleType'] = filters.vehicleType;
    if (filters.status) filter['status'] = filters.status;

    const [docs, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<LeanVehicle[]>(),
      this.model.countDocuments(filter),
    ]);
    return { items: docs.map((d) => this.toDomain(d)), total };
  }

  private toDomain(doc: LeanVehicle): Vehicle {
    return new Vehicle(
      doc._id,
      doc.tenantId,
      doc.licensePlate,
      doc.vehicleType,
      doc.brand,
      doc.model,
      doc.year,
      doc.capacity,
      (doc.defects ?? []).map(
        (d) => new Defect(d.id, d.description, d.reportedAt, d.resolvedAt, d.status),
      ),
      (doc.repairs ?? []).map(
        (r) => new Repair(r.id, r.description, r.date, r.cost, r.mechanic, r.notes),
      ),
      doc.observations ?? '',
      doc.linkedDriverId ?? null,
      doc.status,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
