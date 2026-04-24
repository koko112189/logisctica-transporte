import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Action } from '../../../../shared/domain/enums/action.enum';
import { TmsModule } from '../../../../shared/domain/enums/tms-module.enum';
import { UserRole } from '../../../../shared/domain/enums/user-role.enum';
import { Permission } from '../../../../shared/domain/value-objects/permission.vo';
import { User } from '../../domain/entities/user.entity';
import type { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { UserSchemaClass, type UserDocument } from './user.schema';

type LeanUser = {
  _id: string;
  tenantId: string | null;
  email: string;
  name: string;
  hashedPassword: string;
  isSuperAdmin: boolean;
  isActive: boolean;
  role: UserRole | null;
  permissions: Array<{ module: TmsModule; actions: Action[] }>;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class MongooseUserRepository implements UserRepositoryPort {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly model: Model<UserDocument>,
  ) {}

  async save(user: User): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: user.id },
      {
        _id: user.id,
        tenantId: user.tenantId,
        email: user.email,
        name: user.name,
        hashedPassword: user.hashedPassword,
        isSuperAdmin: user.isSuperAdmin,
        isActive: user.isActive,
        role: user.role,
        permissions: user.permissions.map((p) => ({
          module: p.module,
          actions: p.actions,
        })),
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      { upsert: true, new: true },
    );
  }

  async findById(id: string): Promise<User | null> {
    const doc = await this.model.findById(id).lean<LeanUser>();
    return doc ? this.toDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.model.findOne({ email }).lean<LeanUser>();
    return doc ? this.toDomain(doc) : null;
  }

  async listByTenantId(
    tenantId: string,
    skip: number,
    limit: number,
  ): Promise<{ items: User[]; total: number }> {
    const filter = { tenantId };
    const [docs, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<LeanUser[]>(),
      this.model.countDocuments(filter),
    ]);
    return {
      items: docs.map((d) => this.toDomain(d)),
      total,
    };
  }

  async listAll(
    skip: number,
    limit: number,
  ): Promise<{ items: User[]; total: number }> {
    const [docs, total] = await Promise.all([
      this.model
        .find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<LeanUser[]>(),
      this.model.countDocuments({}),
    ]);
    return {
      items: docs.map((d) => this.toDomain(d)),
      total,
    };
  }

  private toDomain(doc: LeanUser): User {
    const permissions = (doc.permissions ?? []).map(
      (p) => new Permission(p.module, p.actions),
    );
    return new User(
      doc._id,
      doc.tenantId,
      doc.email,
      doc.name,
      doc.hashedPassword,
      doc.isSuperAdmin,
      doc.isActive,
      permissions,
      doc.createdAt,
      doc.updatedAt,
      doc.role ?? null,
    );
  }
}
