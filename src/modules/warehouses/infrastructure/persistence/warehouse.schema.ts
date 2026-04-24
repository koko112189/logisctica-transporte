import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
class Coords {
  @Prop({ required: true }) lat!: number;
  @Prop({ required: true }) lng!: number;
}
const CoordsFactory = SchemaFactory.createForClass(Coords);

export type WarehouseDocument = HydratedDocument<WarehouseSchemaClass>;

@Schema({ collection: 'warehouses', timestamps: false })
export class WarehouseSchemaClass {
  @Prop({ required: true }) _id: string;
  @Prop({ required: true, index: true }) tenantId: string;
  @Prop({ required: true, trim: true }) name: string;
  @Prop({ required: true, trim: true }) address: string;
  @Prop({ required: true, trim: true }) city: string;
  @Prop({ required: true, trim: true, lowercase: true }) notificationEmail: string;
  @Prop({ required: true, trim: true }) phone: string;
  @Prop({ type: CoordsFactory, default: null }) coordinates: { lat: number; lng: number } | null;
  @Prop({ required: true, default: true }) alertOnTripDispatch: boolean;
  @Prop({ required: true, default: true }) isActive: boolean;
  @Prop({ required: true }) createdAt: Date;
  @Prop({ required: true }) updatedAt: Date;
}

export const WarehouseSchema = SchemaFactory.createForClass(WarehouseSchemaClass);
