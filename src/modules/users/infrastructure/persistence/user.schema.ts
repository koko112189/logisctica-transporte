import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Action } from '../../../../shared/domain/enums/action.enum';
import { TmsModule } from '../../../../shared/domain/enums/tms-module.enum';
import { UserRole } from '../../../../shared/domain/enums/user-role.enum';

export type UserDocument = HydratedDocument<UserSchemaClass>;

@Schema({ _id: false })
class PermissionSchema {
  @Prop({ required: true, enum: TmsModule })
  module: TmsModule;

  @Prop({ type: [String], enum: Action, default: [] })
  actions: Action[];
}

const PermissionSchemaFactory = SchemaFactory.createForClass(PermissionSchema);

@Schema({ collection: 'users', timestamps: false })
export class UserSchemaClass {
  @Prop({ required: true })
  _id: string;

  @Prop({ type: String, default: null })
  tenantId: string | null;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  hashedPassword: string;

  @Prop({ required: true, default: false })
  isSuperAdmin: boolean;

  @Prop({ required: true, default: true })
  isActive: boolean;

  @Prop({ type: String, enum: UserRole, default: null })
  role: UserRole | null;

  @Prop({ type: [PermissionSchemaFactory], default: [] })
  permissions: PermissionSchema[];

  @Prop({ required: true })
  createdAt: Date;

  @Prop({ required: true })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);
UserSchema.index({ tenantId: 1 });
