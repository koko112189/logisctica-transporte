import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'driver_profiles', timestamps: false })
export class DriverProfileSchemaClass extends Document {
  @Prop({ required: true }) tenantId!: string;
  @Prop({ required: true }) userId!: string;
  @Prop({ required: true }) licenseNumber!: string;
  @Prop({ required: true }) licenseExpiry!: Date;
  @Prop({ type: String, default: null }) assignedVehicleId!: string | null;
  @Prop({ required: true, default: true }) isActive!: boolean;
  @Prop({ required: true }) createdAt!: Date;
  @Prop({ required: true }) updatedAt!: Date;
}

export const DriverProfileSchema = SchemaFactory.createForClass(DriverProfileSchemaClass);
DriverProfileSchema.index({ tenantId: 1, userId: 1 }, { unique: true });
