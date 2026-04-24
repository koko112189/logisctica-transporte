import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DomiciliaryProfileDocument = HydratedDocument<DomiciliaryProfileSchemaClass>;

@Schema({ collection: 'domiciliary_profiles', timestamps: false })
export class DomiciliaryProfileSchemaClass {
  @Prop({ required: true }) _id: string;
  @Prop({ required: true, index: true }) tenantId: string;
  @Prop({ required: true, index: true }) userId: string;
  @Prop({ required: true, trim: true }) fullName: string;
  @Prop({ required: true, trim: true }) phone: string;
  @Prop({ required: true, trim: true }) documentId: string;
  @Prop({ type: String, default: null }) linkedExternalVehicleId: string | null;
  @Prop({ required: true, default: true }) isActive: boolean;
  @Prop({ required: true }) createdAt: Date;
  @Prop({ required: true }) updatedAt: Date;
}

export const DomiciliaryProfileSchema = SchemaFactory.createForClass(DomiciliaryProfileSchemaClass);
DomiciliaryProfileSchema.index({ tenantId: 1, userId: 1 }, { unique: true });
