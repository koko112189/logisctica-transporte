import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Action } from '../../../../../shared/domain/enums/action.enum';
import { TmsModule } from '../../../../../shared/domain/enums/tms-module.enum';
import { UserRole } from '../../../../../shared/domain/enums/user-role.enum';

class PermissionDto {
  @ApiProperty({ enum: TmsModule, enumName: 'TmsModule' })
  @IsEnum(TmsModule)
  module!: TmsModule;

  @ApiProperty({ enum: Action, enumName: 'Action', isArray: true })
  @IsEnum(Action, { each: true })
  actions!: Action[];
}

export class CreateUserRequestDto {
  @ApiProperty({ format: 'email' })
  @IsEmail()
  email!: string;

  @ApiProperty()
  @IsString()
  @MinLength(1)
  name!: string;

  @ApiProperty({ format: 'password', minLength: 8 })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ type: [PermissionDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionDto)
  permissions!: PermissionDto[];

  @ApiPropertyOptional({ enum: UserRole, enumName: 'UserRole' })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
