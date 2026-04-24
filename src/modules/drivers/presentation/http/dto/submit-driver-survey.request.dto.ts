import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IncidentSeverity } from '../../../domain/enums/incident-severity.enum';
import { IncidentType } from '../../../domain/enums/incident-type.enum';
import { VehicleStateLevel } from '../../../domain/enums/vehicle-state-level.enum';

export class DeliveredItemDto {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiProperty() @IsNumber() quantity!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() unit?: string;
  @ApiProperty() @IsBoolean() confirmed!: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() observations?: string;
}

export class IncidentDto {
  @ApiProperty({ enum: IncidentType }) @IsEnum(IncidentType) type!: IncidentType;
  @ApiProperty() @IsString() @IsNotEmpty() description!: string;
  @ApiProperty({ enum: IncidentSeverity }) @IsEnum(IncidentSeverity) severity!: IncidentSeverity;
}

export class SubmitDriverSurveyRequestDto {
  @ApiProperty({ enum: VehicleStateLevel }) @IsEnum(VehicleStateLevel) vehicleState!: VehicleStateLevel;
  @ApiProperty({ type: [DeliveredItemDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => DeliveredItemDto) deliveredItems!: DeliveredItemDto[];
  @ApiProperty({ type: [IncidentDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => IncidentDto) incidents!: IncidentDto[];
  @ApiProperty() @IsBoolean() chemicalsHandled!: boolean;
  @ApiPropertyOptional({ nullable: true }) @IsOptional() @IsBoolean() chemicalsDelivered?: boolean;
  @ApiProperty() @IsString() observations!: string;
}
