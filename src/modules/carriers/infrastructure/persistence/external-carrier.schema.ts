import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ExternalCarrierDocument = HydratedDocument<ExternalCarrierSchemaClass>;

@Schema({ collection: 'external_carriers', timestamps: false })
export class ExternalCarrierSchemaClass {
  @Prop({ required: true }) _id: string;
  @Prop({ required: true, index: true }) tenantId: string;
  @Prop({ required: true, trim: true }) legalName: string;
  @Prop({ required: true, trim: true, index: true }) taxId: string;
  @Prop({ required: true, trim: true }) contactName: string;
  @Prop({ required: true, trim: true }) contactEmail: string;
  @Prop({ required: true, trim: true }) phone: string;
  @Prop({ default: '' }) notes: string;
  @Prop({ required: true, default: true }) isActive: boolean;
  @Prop({ required: true }) createdAt: Date;
  @Prop({ required: true }) updatedAt: Date;
}

export const ExternalCarrierSchema = SchemaFactory.createForClass(ExternalCarrierSchemaClass);
ExternalCarrierSchema.index({ tenantId: 1, taxId: 1 }, { unique: true });
