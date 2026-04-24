import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DeliveryStatus } from '../../domain/enums/delivery-status.enum';

@Schema({ _id: false })
class SupplyItemSchemaClass {
  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) quantity!: number;
  @Prop({ required: true }) unit!: string;
  @Prop({ required: true }) unitValue!: number;
  @Prop({ required: true }) totalValue!: number;
}

@Schema({ collection: 'store_deliveries', timestamps: false })
export class StoreDeliverySchemaClass extends Document {
  @Prop({ required: true }) tenantId!: string;
  @Prop({ required: true }) tripId!: string;
  @Prop({ required: true }) tripStopOrder!: number;
  @Prop({ required: true }) pickupPointId!: string;
  @Prop({ type: [SupplyItemSchemaClass], default: [] }) supplies!: SupplyItemSchemaClass[];
  @Prop({ required: true, default: 0 }) merchandiseValue!: number;
  @Prop({ type: String, default: null }) creditNoteId!: string | null;
  @Prop({ required: true, enum: DeliveryStatus, default: DeliveryStatus.PENDING }) status!: DeliveryStatus;
  @Prop({ default: '' }) observations!: string;
  @Prop({ type: Date, default: null }) deliveredAt!: Date | null;
  @Prop({ type: String, default: null }) receivedByName!: string | null;
  @Prop({ required: true }) createdAt!: Date;
  @Prop({ required: true }) updatedAt!: Date;
}

export const StoreDeliverySchema = SchemaFactory.createForClass(StoreDeliverySchemaClass);
StoreDeliverySchema.index({ tenantId: 1, tripId: 1 });
