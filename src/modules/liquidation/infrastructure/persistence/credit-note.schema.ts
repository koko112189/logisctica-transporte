import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CreditNoteStatus } from '../../domain/enums/credit-note-status.enum';

@Schema({ _id: false })
class CreditNoteItemSchemaClass {
  @Prop({ required: true }) description!: string;
  @Prop({ required: true }) quantity!: number;
  @Prop({ required: true }) unitValue!: number;
  @Prop({ required: true }) totalValue!: number;
}

@Schema({ collection: 'credit_notes', timestamps: false })
export class CreditNoteSchemaClass extends Document {
  @Prop({ required: true }) tenantId!: string;
  @Prop({ required: true }) tripId!: string;
  @Prop({ required: true }) storeDeliveryId!: string;
  @Prop({ required: true }) number!: string;
  @Prop({ required: true }) reason!: string;
  @Prop({ type: [CreditNoteItemSchemaClass], default: [] }) items!: CreditNoteItemSchemaClass[];
  @Prop({ required: true, default: 0 }) totalAmount!: number;
  @Prop({ type: Date, default: null }) issuedAt!: Date | null;
  @Prop({ required: true, enum: CreditNoteStatus, default: CreditNoteStatus.DRAFT }) status!: CreditNoteStatus;
  @Prop({ required: true }) createdAt!: Date;
}

export const CreditNoteSchema = SchemaFactory.createForClass(CreditNoteSchemaClass);
CreditNoteSchema.index({ tenantId: 1, number: 1 }, { unique: true });
CreditNoteSchema.index({ tenantId: 1, tripId: 1 });
