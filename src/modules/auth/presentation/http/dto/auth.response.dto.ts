import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ description: 'JWT de acceso' })
  accessToken!: string;

  @ApiProperty({ description: 'JWT de refresco' })
  refreshToken!: string;
}

export class MePermissionItemDto {
  @ApiProperty({ example: 'USERS' })
  module!: string;

  @ApiProperty({ type: [String], example: ['READ', 'WRITE'] })
  actions!: string[];
}

export class MeResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ nullable: true })
  tenantId!: string | null;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  isSuperAdmin!: boolean;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty({ type: [MePermissionItemDto] })
  permissions!: MePermissionItemDto[];
}
