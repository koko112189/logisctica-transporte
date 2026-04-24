import { ApiProperty } from '@nestjs/swagger';
import { Action } from '../../../../../shared/domain/enums/action.enum';
import { TmsModule } from '../../../../../shared/domain/enums/tms-module.enum';
import { UserRole } from '../../../../../shared/domain/enums/user-role.enum';

class PermissionResponseDto {
  @ApiProperty({ enum: TmsModule, enumName: 'TmsModule' })
  module!: TmsModule;

  @ApiProperty({ enum: Action, enumName: 'Action', isArray: true })
  actions!: Action[];
}

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ nullable: true })
  tenantId!: string | null;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ enum: UserRole, enumName: 'UserRole', nullable: true })
  role!: UserRole | null;

  @ApiProperty({ type: [PermissionResponseDto] })
  permissions!: PermissionResponseDto[];

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}
