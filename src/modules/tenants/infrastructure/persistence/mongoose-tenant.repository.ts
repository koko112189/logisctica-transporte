import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tenant } from '../../domain/entities/tenant.entity';
import type { TenantRepositoryPort } from '../../domain/ports/tenant.repository.port';
import { TenantSchemaClass, type TenantDocument } from './tenant.schema';

type LeanTenant = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MongooseTenantRepository implements TenantRepositoryPort {
  constructor(
    @InjectModel(TenantSchemaClass.name)
    private readonly model: Model<TenantDocument>,
  ) {}

  async save(tenant: Tenant): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: tenant.id },
      {
        _id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        isActive: tenant.isActive,
        createdAt: tenant.createdAt,
        updatedAt: tenant.updatedAt,
      },
      { upsert: true, new: true },
    );
  }

  async findById(id: string): Promise<Tenant | null> {
    const doc = await this.model.findById(id).lean<LeanTenant>();
    return doc ? this.toDomain(doc) : null;
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    const doc = await this.model.findOne({ slug }).lean<LeanTenant>();
    return doc ? this.toDomain(doc) : null;
  }

  async list(
    skip: number,
    limit: number,
  ): Promise<{ items: Tenant[]; total: number }> {
    const [docs, total] = await Promise.all([
      this.model
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<LeanTenant[]>(),
      this.model.countDocuments({}),
    ]);
    return {
      items: docs.map((d) => this.toDomain(d)),
      total,
    };
  }

  private toDomain(doc: LeanTenant): Tenant {
    return new Tenant(
      doc._id,
      doc.name,
      doc.slug,
      doc.isActive,
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
