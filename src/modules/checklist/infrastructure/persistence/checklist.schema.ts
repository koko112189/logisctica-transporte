import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ChecklistCategory } from '../../domain/enums/checklist-category.enum';
import { ChecklistStatus } from '../../domain/enums/checklist-status.enum';
import { ChecklistTemplate } from '../../domain/enums/checklist-template.enum';
import { FuelLevel } from '../../domain/enums/fuel-level.enum';
import { ItemStatus } from '../../domain/enums/item-status.enum';

export type ChecklistDocument = HydratedDocument<ChecklistSchemaClass>;

@Schema({ _id: false })
class ChecklistItemSchemaClass {
  @Prop({ required: true, enum: ChecklistCategory }) category: ChecklistCategory;
  @Prop({ required: true }) name: string;
  @Prop({ required: true, enum: ItemStatus, default: ItemStatus.NA }) status: ItemStatus;
  @Prop({ type: String, default: null }) observation: string | null;
}
const ChecklistItemSchemaFactory = SchemaFactory.createForClass(ChecklistItemSchemaClass);

@Schema({ collection: 'checklists', timestamps: false })
export class ChecklistSchemaClass {
  @Prop({ required: true }) _id: string;
  @Prop({ required: true, index: true }) tenantId: string;
  @Prop({ required: true, index: true }) vehicleId: string;
  @Prop({ required: true, index: true }) driverId: string;
  @Prop({ required: true }) date: string; // 'YYYY-MM-DD'
  @Prop({ type: [ChecklistItemSchemaFactory], default: [] })
  items: ChecklistItemSchemaClass[];
  @Prop({ type: String, enum: FuelLevel, default: null }) fuelLevel: FuelLevel | null;
  @Prop({ required: true, default: false }) previousTasksConfirmed: boolean;
  @Prop({ default: '' }) generalObservations: string;
  @Prop({ required: true, enum: ChecklistTemplate }) checklistTemplate: ChecklistTemplate;
  @Prop({ required: true, enum: ChecklistStatus, default: ChecklistStatus.PENDING })
  status: ChecklistStatus;
  @Prop({ type: Date, default: null }) submittedAt: Date | null;
  @Prop({ required: true }) createdAt: Date;
}

export const ChecklistSchema = SchemaFactory.createForClass(ChecklistSchemaClass);
ChecklistSchema.index({ tenantId: 1, vehicleId: 1, date: 1 }, { unique: true });
ChecklistSchema.index({ tenantId: 1, driverId: 1, status: 1 });
