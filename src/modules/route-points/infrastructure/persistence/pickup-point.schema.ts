import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PickupPointType } from '../../domain/enums/pickup-point-type.enum';

@Schema({ _id: false })
class CoordinatesSchemaClass {
  @Prop({ required: true }) lat!: number;
  @Prop({ required: true }) lng!: number;
}

@Schema({ collection: 'pickup_points', timestamps: false })
export class PickupPointSchemaClass extends Document {
  @Prop({ required: true }) tenantId!: string;
  @Prop({ required: true }) name!: string;
  @Prop({ required: true, enum: PickupPointType }) type!: PickupPointType;
  @Prop({ required: true }) address!: string;
  @Prop({ required: true }) city!: string;
  @Prop({ type: String, default: null }) postalCode!: string | null;
  @Prop({ type: CoordinatesSchemaClass, default: null }) coordinates!: CoordinatesSchemaClass | null;
  @Prop({ type: String, default: null }) contactName!: string | null;
  @Prop({ type: String, default: null }) contactPhone!: string | null;
  @Prop({ type: String, default: null }) contactEmail!: string | null;
  @Prop({ type: String, default: null }) operatingHours!: string | null;
  @Prop({ required: true, default: true }) isActive!: boolean;
  @Prop({ required: true }) createdAt!: Date;
  @Prop({ required: true }) updatedAt!: Date;
}

export const PickupPointSchema = SchemaFactory.createForClass(PickupPointSchemaClass);
PickupPointSchema.index({ tenantId: 1, name: 1 });
PickupPointSchema.index({ tenantId: 1, isActive: 1 });
