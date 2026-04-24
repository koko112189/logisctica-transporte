import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DomiciliaryProfile } from '../../domain/entities/domiciliary-profile.entity';
import { DomiciliaryProfileRepositoryPort } from '../../domain/ports/domiciliary-profile.repository.port';
import { DomiciliaryProfileSchemaClass } from './domiciliary-profile.schema';

@Injectable()
export class MongooseDomiciliaryProfileRepository
  implements DomiciliaryProfileRepositoryPort
{
  constructor(
    @InjectModel(DomiciliaryProfileSchemaClass.name)
    private readonly model: Model<DomiciliaryProfileSchemaClass>,
  ) {}

  async save(profile: DomiciliaryProfile): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: profile.id },
      {
        $set: {
          tenantId: profile.tenantId,
          userId: profile.userId,
          fullName: profile.fullName,
          phone: profile.phone,
          documentId: profile.documentId,
          linkedExternalVehicleId: profile.linkedExternalVehicleId,
          isActive: profile.isActive,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
        },
      },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<DomiciliaryProfile | null> {
    const d = await this.model.findOne({ _id: id, tenantId }).lean();
    return d ? this.to(d) : null;
  }

  async findByUserId(
    userId: string,
    tenantId: string,
  ): Promise<DomiciliaryProfile | null> {
    const d = await this.model.findOne({ userId, tenantId }).lean();
    return d ? this.to(d) : null;
  }

  async list(
    tenantId: string,
    page: number,
    limit: number,
    activeOnly: boolean,
  ): Promise<{ items: DomiciliaryProfile[]; total: number }> {
    const q: Record<string, unknown> = { tenantId };
    if (activeOnly) q['isActive'] = true;
    const [docs, total] = await Promise.all([
      this.model
        .find(q)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<DomiciliaryProfileSchemaClass[]>(),
      this.model.countDocuments(q),
    ]);
    return { items: docs.map((x) => this.to(x)), total };
  }

  private to(d: DomiciliaryProfileSchemaClass): DomiciliaryProfile {
    return new DomiciliaryProfile(
      d._id,
      d.tenantId,
      d.userId,
      d.fullName,
      d.phone,
      d.documentId,
      d.linkedExternalVehicleId,
      d.isActive,
      d.createdAt,
      d.updatedAt,
    );
  }
}
