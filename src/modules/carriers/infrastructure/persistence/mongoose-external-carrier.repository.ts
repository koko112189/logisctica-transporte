import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExternalCarrier } from '../../domain/entities/external-carrier.entity';
import { ExternalCarrierRepositoryPort } from '../../domain/ports/external-carrier.repository.port';
import { ExternalCarrierSchemaClass } from './external-carrier.schema';

@Injectable()
export class MongooseExternalCarrierRepository implements ExternalCarrierRepositoryPort {
  constructor(
    @InjectModel(ExternalCarrierSchemaClass.name)
    private readonly model: Model<ExternalCarrierSchemaClass>,
  ) {}

  async save(carrier: ExternalCarrier): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: carrier.id },
      {
        $set: {
          tenantId: carrier.tenantId,
          legalName: carrier.legalName,
          taxId: carrier.taxId,
          contactName: carrier.contactName,
          contactEmail: carrier.contactEmail,
          phone: carrier.phone,
          notes: carrier.notes,
          isActive: carrier.isActive,
          createdAt: carrier.createdAt,
          updatedAt: carrier.updatedAt,
        },
      },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<ExternalCarrier | null> {
    const doc = await this.model.findOne({ _id: id, tenantId }).lean();
    return doc ? this.toDomain(doc) : null;
  }

  async list(
    tenantId: string,
    page: number,
    limit: number,
    activeOnly: boolean,
  ): Promise<{ items: ExternalCarrier[]; total: number }> {
    const q: Record<string, unknown> = { tenantId };
    if (activeOnly) q['isActive'] = true;
    const [docs, total] = await Promise.all([
      this.model
        .find(q)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean<ExternalCarrierSchemaClass[]>(),
      this.model.countDocuments(q),
    ]);
    return { items: docs.map((d) => this.toDomain(d)), total };
  }

  async findByTaxId(taxId: string, tenantId: string): Promise<ExternalCarrier | null> {
    const doc = await this.model.findOne({ taxId, tenantId }).lean<ExternalCarrierSchemaClass | null>();
    return doc ? this.toDomain(doc) : null;
  }

  private toDomain(d: ExternalCarrierSchemaClass): ExternalCarrier {
    return new ExternalCarrier(
      d._id,
      d.tenantId,
      d.legalName,
      d.taxId,
      d.contactName,
      d.contactEmail,
      d.phone,
      d.notes,
      d.isActive,
      d.createdAt,
      d.updatedAt,
    );
  }
}
