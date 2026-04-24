import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TenantDocument = HydratedDocument<TenantSchemaClass>;

@Schema({ collection: 'tenants', timestamps: false })
export class TenantSchemaClass {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const TenantSchema = SchemaFactory.createForClass(TenantSchemaClass);
