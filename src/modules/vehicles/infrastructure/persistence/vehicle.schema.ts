import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DefectStatus } from '../../domain/enums/defect-status.enum';
import { VehicleStatus } from '../../domain/enums/vehicle-status.enum';
import { VehicleType } from '../../domain/enums/vehicle-type.enum';

export type VehicleDocument = HydratedDocument<VehicleSchemaClass>;

@Schema({ _id: false })
class DefectSchemaClass {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) description: string;
  @Prop({ required: true }) reportedAt: Date;
  @Prop({ type: Date, default: null }) resolvedAt: Date | null;
  @Prop({ required: true, enum: DefectStatus }) status: DefectStatus;
}
const DefectSchemaFactory = SchemaFactory.createForClass(DefectSchemaClass);

@Schema({ _id: false })
class RepairSchemaClass {
  @Prop({ required: true }) id: string;
  @Prop({ required: true }) description: string;
  @Prop({ required: true }) date: Date;
  @Prop({ type: Number, default: null }) cost: number | null;
  @Prop({ type: String, default: null }) mechanic: string | null;
  @Prop({ type: String, default: null }) notes: string | null;
}
const RepairSchemaFactory = SchemaFactory.createForClass(RepairSchemaClass);

@Schema({ collection: 'vehicles', timestamps: false })
export class VehicleSchemaClass {
  @Prop({ required: true }) _id: string;
  @Prop({ required: true, index: true }) tenantId: string;
  @Prop({ required: true }) licensePlate: string;
  @Prop({ required: true, enum: VehicleType }) vehicleType: VehicleType;
  @Prop({ required: true }) brand: string;
  @Prop({ required: true }) model: string;
  @Prop({ required: true }) year: number;
  @Prop({ required: true }) capacity: number;
  @Prop({ type: [DefectSchemaFactory], default: [] })
  defects: DefectSchemaClass[];
  @Prop({ type: [RepairSchemaFactory], default: [] })
  repairs: RepairSchemaClass[];
  @Prop({ default: '' }) observations: string;
  @Prop({ type: String, default: null }) linkedDriverId: string | null;
  @Prop({ required: true, enum: VehicleStatus, default: VehicleStatus.ACTIVE })
  status: VehicleStatus;
  @Prop({ required: true }) createdAt: Date;
  @Prop({ required: true }) updatedAt: Date;
}

export const VehicleSchema = SchemaFactory.createForClass(VehicleSchemaClass);
VehicleSchema.index({ tenantId: 1, licensePlate: 1 }, { unique: true });
