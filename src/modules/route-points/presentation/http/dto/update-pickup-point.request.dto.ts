import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PickupPointType } from '../../../domain/enums/pickup-point-type.enum';

export class UpdatePickupPointRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() name?: string;
  @ApiPropertyOptional({ enum: PickupPointType }) @IsOptional() @IsEnum(PickupPointType) type?: PickupPointType;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @IsNotEmpty() city?: string;
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() postalCode?: string | null;
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsNumber() lat?: number | null;
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsNumber() lng?: number | null;
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() contactName?: string | null;
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() contactPhone?: string | null;
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsEmail() contactEmail?: string | null;
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsString() operatingHours?: string | null;
}
