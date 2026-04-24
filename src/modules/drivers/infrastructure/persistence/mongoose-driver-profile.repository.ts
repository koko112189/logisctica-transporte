import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { DriverProfile } from '../../domain/entities/driver-profile.entity';
import type { DriverProfileRepositoryPort } from '../../domain/ports/driver-profile.repository.port';
import { DriverProfileSchemaClass } from './driver-profile.schema';

type LeanProfile = { _id: { toString(): string }; tenantId: string; userId: string; licenseNumber: string; licenseExpiry: Date; assignedVehicleId: string | null; isActive: boolean; createdAt: Date; updatedAt: Date };

@Injectable()
export class MongooseDriverProfileRepository implements DriverProfileRepositoryPort {
  constructor(
    @InjectModel(DriverProfileSchemaClass.name)
    private readonly model: Model<DriverProfileSchemaClass>,
  ) {}

  async save(profile: DriverProfile): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: profile.id },
      { $set: { tenantId: profile.tenantId, userId: profile.userId, licenseNumber: profile.licenseNumber, licenseExpiry: profile.licenseExpiry, assignedVehicleId: profile.assignedVehicleId, isActive: profile.isActive, createdAt: profile.createdAt, updatedAt: profile.updatedAt } },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<DriverProfile | null> {
    const doc = await this.model.findOne({ _id: id, tenantId }).lean<LeanProfile>();
    return doc ? this.toDomain(doc) : null;
  }

  async findByUserId(userId: string, tenantId: string): Promise<DriverProfile | null> {
    const doc = await this.model.findOne({ userId, tenantId }).lean<LeanProfile>();
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(tenantId: string, page: number, limit: number): Promise<{ items: DriverProfile[]; total: number }> {
    const [docs, total] = await Promise.all([
      this.model.find({ tenantId }).skip((page - 1) * limit).limit(limit).lean<LeanProfile[]>(),
      this.model.countDocuments({ tenantId }),
    ]);
    return { items: docs.map((d) => this.toDomain(d)), total };
  }

  private toDomain(doc: LeanProfile): DriverProfile {
    return new DriverProfile(doc._id.toString(), doc.tenantId, doc.userId, doc.licenseNumber, doc.licenseExpiry, doc.assignedVehicleId, doc.isActive, doc.createdAt, doc.updatedAt);
  }
}
