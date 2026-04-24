import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IncidentSeverity } from '../../domain/enums/incident-severity.enum';
import { IncidentType } from '../../domain/enums/incident-type.enum';
import { SurveyStatus } from '../../domain/enums/survey-status.enum';
import { VehicleStateLevel } from '../../domain/enums/vehicle-state-level.enum';

@Schema({ _id: false })
class DeliveredItemSchemaClass {
  @Prop({ required: true }) name!: string;
  @Prop({ required: true }) quantity!: number;
  @Prop({ type: String, default: null }) unit!: string | null;
  @Prop({ required: true }) confirmed!: boolean;
  @Prop({ type: String, default: null }) observations!: string | null;
}

@Schema({ _id: false })
class IncidentSchemaClass {
  @Prop({ required: true, enum: IncidentType }) type!: IncidentType;
  @Prop({ required: true }) description!: string;
  @Prop({ required: true, enum: IncidentSeverity }) severity!: IncidentSeverity;
}

@Schema({ collection: 'driver_surveys', timestamps: false })
export class DriverSurveySchemaClass extends Document {
  @Prop({ required: true }) tenantId!: string;
  @Prop({ required: true }) driverId!: string;
  @Prop({ required: true }) vehicleId!: string;
  @Prop({ required: true }) date!: string; // 'YYYY-MM-DD'
  @Prop({ type: String, enum: VehicleStateLevel, default: null }) vehicleState!: VehicleStateLevel | null;
  @Prop({ type: [DeliveredItemSchemaClass], default: [] }) deliveredItems!: DeliveredItemSchemaClass[];
  @Prop({ type: [IncidentSchemaClass], default: [] }) incidents!: IncidentSchemaClass[];
  @Prop({ required: true, default: false }) chemicalsHandled!: boolean;
  @Prop({ type: Boolean, default: null }) chemicalsDelivered!: boolean | null;
  @Prop({ default: '' }) observations!: string;
  @Prop({ required: true, enum: SurveyStatus, default: SurveyStatus.PENDING }) status!: SurveyStatus;
  @Prop({ type: Date, default: null }) submittedAt!: Date | null;
  @Prop({ required: true }) createdAt!: Date;
}

export const DriverSurveySchema = SchemaFactory.createForClass(DriverSurveySchemaClass);
DriverSurveySchema.index({ tenantId: 1, driverId: 1, status: 1 });
DriverSurveySchema.index({ tenantId: 1, driverId: 1, date: 1 });
