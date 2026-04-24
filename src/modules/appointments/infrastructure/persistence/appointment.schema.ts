import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AppointmentStatus } from '../../domain/enums/appointment-status.enum';

export type AppointmentDocument = HydratedDocument<AppointmentSchemaClass>;

@Schema({ _id: false })
class LocationSchemaClass {
  @Prop({ required: true }) address: string;
  @Prop({ required: true }) city: string;
  @Prop({ type: Number, default: null }) lat: number | null;
  @Prop({ type: Number, default: null }) lng: number | null;
}
const LocationSchemaFactory = SchemaFactory.createForClass(LocationSchemaClass);

@Schema({ collection: 'appointments', timestamps: false })
export class AppointmentSchemaClass {
  @Prop({ required: true }) _id: string;
  @Prop({ required: true, index: true }) tenantId: string;
  @Prop({ required: true, index: true }) vehicleId: string;
  @Prop({ required: true, index: true }) driverId: string;
  @Prop({ required: true }) title: string;
  @Prop({ default: '' }) description: string;
  @Prop({ type: LocationSchemaFactory, required: true }) origin: LocationSchemaClass;
  @Prop({ type: LocationSchemaFactory, required: true }) destination: LocationSchemaClass;
  @Prop({ required: true, index: true }) scheduledAt: Date;
  @Prop({ required: true }) estimatedDurationMinutes: number;
  @Prop({ required: true, enum: AppointmentStatus, default: AppointmentStatus.SCHEDULED })
  status: AppointmentStatus;
  @Prop({ type: Date, default: null }) notificationSentAt: Date | null;
  @Prop({ required: true }) createdAt: Date;
  @Prop({ required: true }) updatedAt: Date;
}

export const AppointmentSchema = SchemaFactory.createForClass(AppointmentSchemaClass);
AppointmentSchema.index({ tenantId: 1, scheduledAt: 1 });
AppointmentSchema.index({ tenantId: 1, driverId: 1, status: 1 });
