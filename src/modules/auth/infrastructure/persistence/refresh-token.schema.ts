import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshTokenSchemaClass>;

@Schema({ collection: 'refresh_tokens', timestamps: false })
export class RefreshTokenSchemaClass {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ type: String, default: null })
  tenantId: string | null;

  @Prop({ required: true, unique: true })
  tokenHash: string;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true, default: false })
  isRevoked: boolean;

  @Prop({ required: true })
  createdAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(
  RefreshTokenSchemaClass,
);
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
