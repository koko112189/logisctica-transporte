import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { LightVehicleKind } from '../../domain/enums/light-vehicle-kind.enum';

export type ExternalVehicleDocument = HydratedDocument<ExternalVehicleSchemaClass>;

@Schema({ collection: 'external_vehicles', timestamps: false })
export class ExternalVehicleSchemaClass {
  @Prop({ required: true }) _id: string;
  @Prop({ required: true, index: true }) tenantId: string;
  @Prop({ required: true, index: true }) carrierId: string;
  @Prop({ required: true, trim: true }) licensePlate: string;
  @Prop({ required: true, enum: LightVehicleKind }) kind: LightVehicleKind;
  @Prop({ required: true, trim: true }) label: string;
  @Prop({ required: true, min: 0 }) capacityKg: number;
  @Prop({ required: true, default: true }) isActive: boolean;
  @Prop({ default: '' }) notes: string;
  @Prop({ required: true }) createdAt: Date;
  @Prop({ required: true }) updatedAt: Date;
}

export const ExternalVehicleSchema = SchemaFactory.createForClass(ExternalVehicleSchemaClass);
ExternalVehicleSchema.index({ tenantId: 1, licensePlate: 1 }, { unique: true });
