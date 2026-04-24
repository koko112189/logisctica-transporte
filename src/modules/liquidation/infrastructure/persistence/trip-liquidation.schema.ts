import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ExpenseType } from '../../domain/enums/expense-type.enum';
import { LiquidationStatus } from '../../domain/enums/liquidation-status.enum';

@Schema({ _id: false })
class ExpenseSchemaClass {
  @Prop({ required: true, enum: ExpenseType }) type!: ExpenseType;
  @Prop({ required: true }) description!: string;
  @Prop({ required: true }) amount!: number;
  @Prop({ type: String, default: null }) receiptUrl!: string | null;
}

@Schema({ _id: false })
class CommissionSchemaClass {
  @Prop({ required: true }) description!: string;
  @Prop({ required: true }) amount!: number;
}

@Schema({ collection: 'trip_liquidations', timestamps: false })
export class TripLiquidationSchemaClass extends Document {
  @Prop({ required: true }) tenantId!: string;
  @Prop({ required: true }) tripId!: string;
  @Prop({ required: true, default: 0 }) totalMerchandiseValue!: number;
  @Prop({ type: [ExpenseSchemaClass], default: [] }) travelExpenses!: ExpenseSchemaClass[];
  @Prop({ required: true, default: 0 }) driverCommission!: number;
  @Prop({ type: [CommissionSchemaClass], default: [] }) otherCommissions!: CommissionSchemaClass[];
  @Prop({ required: true, enum: LiquidationStatus, default: LiquidationStatus.DRAFT }) status!: LiquidationStatus;
  @Prop({ type: String, default: null }) approvedByUserId!: string | null;
  @Prop({ type: Date, default: null }) approvedAt!: Date | null;
  @Prop({ required: true }) createdAt!: Date;
  @Prop({ required: true }) updatedAt!: Date;
}

export const TripLiquidationSchema = SchemaFactory.createForClass(TripLiquidationSchemaClass);
TripLiquidationSchema.index({ tenantId: 1, tripId: 1 }, { unique: true });
