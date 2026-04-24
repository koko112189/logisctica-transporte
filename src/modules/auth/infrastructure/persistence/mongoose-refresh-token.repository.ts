import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import type { RefreshTokenRepositoryPort } from '../../domain/ports/refresh-token.repository.port';
import {
  RefreshTokenSchemaClass,
  type RefreshTokenDocument,
} from './refresh-token.schema';

type LeanRefreshToken = {
  _id: string;
  userId: string;
  tenantId: string | null;
  tokenHash: string;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
};

@Injectable()
export class MongooseRefreshTokenRepository implements RefreshTokenRepositoryPort {
  constructor(
    @InjectModel(RefreshTokenSchemaClass.name)
    private readonly model: Model<RefreshTokenDocument>,
  ) {}

  async save(token: RefreshToken): Promise<void> {
    await this.model.create({
      _id: token.id,
      userId: token.userId,
      tenantId: token.tenantId,
      tokenHash: token.tokenHash,
      expiresAt: token.expiresAt,
      isRevoked: token.isRevoked,
      createdAt: token.createdAt,
    });
  }

  async findByTokenHash(hash: string): Promise<RefreshToken | null> {
    const doc = await this.model
      .findOne({ tokenHash: hash })
      .lean<LeanRefreshToken>();
    return doc ? this.toDomain(doc) : null;
  }

  async revokeAllByUserId(userId: string): Promise<void> {
    await this.model.updateMany(
      { userId, isRevoked: false },
      { isRevoked: true },
    );
  }

  async revokeByTokenHash(hash: string): Promise<void> {
    await this.model.updateOne({ tokenHash: hash }, { isRevoked: true });
  }

  private toDomain(doc: LeanRefreshToken): RefreshToken {
    return new RefreshToken(
      doc._id,
      doc.userId,
      doc.tenantId,
      doc.tokenHash,
      doc.expiresAt,
      doc.isRevoked,
      doc.createdAt,
    );
  }
}
