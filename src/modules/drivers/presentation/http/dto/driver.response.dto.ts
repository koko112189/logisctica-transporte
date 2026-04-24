import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IncidentSeverity } from '../../../domain/enums/incident-severity.enum';
import { IncidentType } from '../../../domain/enums/incident-type.enum';
import { SurveyStatus } from '../../../domain/enums/survey-status.enum';
import { VehicleStateLevel } from '../../../domain/enums/vehicle-state-level.enum';

export class DriverProfileResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() tenantId!: string;
  @ApiProperty() userId!: string;
  @ApiProperty() licenseNumber!: string;
  @ApiProperty({ format: 'date-time' }) licenseExpiry!: string;
  @ApiProperty({ nullable: true }) assignedVehicleId!: string | null;
  @ApiProperty() isActive!: boolean;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;
}

export class ListDriverProfilesResponseDto {
  @ApiProperty({ type: [DriverProfileResponseDto] }) items!: DriverProfileResponseDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
}

class DeliveredItemResponseDto {
  @ApiProperty() name!: string;
  @ApiProperty() quantity!: number;
  @ApiProperty({ nullable: true }) unit!: string | null;
  @ApiProperty() confirmed!: boolean;
  @ApiProperty({ nullable: true }) observations!: string | null;
}

class IncidentResponseDto {
  @ApiProperty({ enum: IncidentType }) type!: IncidentType;
  @ApiProperty() description!: string;
  @ApiProperty({ enum: IncidentSeverity }) severity!: IncidentSeverity;
}

export class DriverSurveyResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() tenantId!: string;
  @ApiProperty() driverId!: string;
  @ApiProperty() vehicleId!: string;
  @ApiProperty() date!: string;
  @ApiPropertyOptional({ enum: VehicleStateLevel, nullable: true }) vehicleState!: VehicleStateLevel | null;
  @ApiProperty({ type: [DeliveredItemResponseDto] }) deliveredItems!: DeliveredItemResponseDto[];
  @ApiProperty({ type: [IncidentResponseDto] }) incidents!: IncidentResponseDto[];
  @ApiProperty() chemicalsHandled!: boolean;
  @ApiPropertyOptional({ nullable: true }) chemicalsDelivered!: boolean | null;
  @ApiProperty() observations!: string;
  @ApiProperty({ enum: SurveyStatus }) status!: SurveyStatus;
  @ApiProperty({ nullable: true, format: 'date-time' }) submittedAt!: string | null;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
}
