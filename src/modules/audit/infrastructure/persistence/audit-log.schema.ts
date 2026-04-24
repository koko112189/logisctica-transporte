import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuditLogDocument = HydratedDocument<AuditLogSchemaClass>;

@Schema({ collection: 'audit_logs', timestamps: false })
export class AuditLogSchemaClass {
  @Prop({ required: true }) _id: string;
  @Prop({ required: true, index: true }) tenantId: string;
  @Prop({ required: true, index: true }) eventName: string;
  @Prop({ type: Object, default: {} }) payload: Record<string, unknown>;
  @Prop({ type: String, default: null }) userId: string | null;
  @Prop({ required: true, index: true }) createdAt: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLogSchemaClass);
AuditLogSchema.index({ tenantId: 1, createdAt: -1 });
