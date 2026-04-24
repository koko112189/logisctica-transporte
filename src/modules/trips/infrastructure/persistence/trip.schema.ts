import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { StopStatus } from '../../domain/enums/stop-status.enum';
import { StopType } from '../../domain/enums/stop-type.enum';
import { TripEvent } from '../../domain/enums/trip-event.enum';
import { TripStatus } from '../../domain/enums/trip-status.enum';
import { VehicleCategory } from '../../domain/enums/vehicle-category.enum';

@Schema({ _id: false })
class CoordinatesSchemaClass {
  @Prop({ required: true }) lat!: number;
  @Prop({ required: true }) lng!: number;
}

@Schema({ _id: false })
class LocationSchemaClass {
  @Prop({ required: true }) address!: string;
  @Prop({ required: true }) city!: string;
  @Prop({ type: CoordinatesSchemaClass, default: null }) coordinates!: CoordinatesSchemaClass | null;
}

@Schema({ _id: false })
class TripStopSchemaClass {
  @Prop({ required: true }) stopOrder!: number;
  @Prop({ required: true }) pickupPointId!: string;
  @Prop({ required: true, enum: StopType }) type!: StopType;
  @Prop({ type: Date, default: null }) scheduledArrival!: Date | null;
  @Prop({ type: Date, default: null }) actualArrival!: Date | null;
  @Prop({ required: true, enum: StopStatus, default: StopStatus.PENDING }) status!: StopStatus;
  @Prop({ type: String, default: null }) notes!: string | null;
  @Prop({ type: String, default: null }) storeDeliveryId!: string | null;
}

@Schema({ _id: false })
class TripAuditEntrySchemaClass {
  @Prop({ required: true }) timestamp!: Date;
  @Prop({ required: true, enum: TripEvent }) event!: TripEvent;
  @Prop({ required: true }) description!: string;
  @Prop({ type: Object, default: null }) metadata!: Record<string, unknown> | null;
  @Prop({ type: String, default: null }) performedByUserId!: string | null;
}

@Schema({ collection: 'trips', timestamps: false })
export class TripSchemaClass extends Document {
  @Prop({ required: true }) tenantId!: string;
  @Prop({ required: true }) vehicleId!: string;
  @Prop({ required: true }) driverId!: string;
  @Prop({ type: String, default: null }) appointmentId!: string | null;
  @Prop({ required: true, enum: VehicleCategory }) vehicleCategory!: VehicleCategory;
  @Prop({ required: true, default: false }) isExternalCarrier!: boolean;
  @Prop({ type: String, default: null }) domiciliaryId!: string | null;
  @Prop({ type: String, default: null }) externalCarrierId!: string | null;
  @Prop({ type: String, default: null }) externalVehicleId!: string | null;
  @Prop({ type: String, default: null }) originWarehouseId!: string | null;
  @Prop({ type: LocationSchemaClass, required: true }) origin!: LocationSchemaClass;
  @Prop({ type: LocationSchemaClass, required: true }) destination!: LocationSchemaClass;
  @Prop({ type: [TripStopSchemaClass], default: [] }) stops!: TripStopSchemaClass[];
  @Prop({ type: Date, default: null }) startedAt!: Date | null;
  @Prop({ type: Date, default: null }) estimatedArrival!: Date | null;
  @Prop({ type: Date, default: null }) actualArrival!: Date | null;
  @Prop({ type: CoordinatesSchemaClass, default: null }) currentLocation!: CoordinatesSchemaClass | null;
  @Prop({ type: Date, default: null }) lastLocationUpdatedAt!: Date | null;
  @Prop({ required: true, enum: TripStatus, default: TripStatus.PENDING }) status!: TripStatus;
  @Prop({ required: true, default: false }) checklistComplied!: boolean;
  @Prop({ type: [TripAuditEntrySchemaClass], default: [] }) auditLog!: TripAuditEntrySchemaClass[];
  @Prop({ required: true }) createdAt!: Date;
  @Prop({ required: true }) updatedAt!: Date;
}

export const TripSchema = SchemaFactory.createForClass(TripSchemaClass);
TripSchema.index({ tenantId: 1, status: 1 });
TripSchema.index({ tenantId: 1, driverId: 1, status: 1 });
TripSchema.index({ tenantId: 1, vehicleId: 1, status: 1 });
TripSchema.index({ tenantId: 1, createdAt: -1 });
