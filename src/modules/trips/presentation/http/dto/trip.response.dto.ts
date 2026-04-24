import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StopStatus } from '../../../domain/enums/stop-status.enum';
import { StopType } from '../../../domain/enums/stop-type.enum';
import { TripEvent } from '../../../domain/enums/trip-event.enum';
import { TripStatus } from '../../../domain/enums/trip-status.enum';
import { VehicleCategory } from '../../../domain/enums/vehicle-category.enum';

class TripLocationDto {
  @ApiProperty() address!: string;
  @ApiProperty() city!: string;
  @ApiProperty({ nullable: true }) lat!: number | null;
  @ApiProperty({ nullable: true }) lng!: number | null;
}

class TripStopResponseDto {
  @ApiProperty() stopOrder!: number;
  @ApiProperty() pickupPointId!: string;
  @ApiProperty({ enum: StopType }) type!: StopType;
  @ApiProperty({ nullable: true, format: 'date-time' }) scheduledArrival!: string | null;
  @ApiProperty({ nullable: true, format: 'date-time' }) actualArrival!: string | null;
  @ApiProperty({ enum: StopStatus }) status!: StopStatus;
  @ApiProperty({ nullable: true }) notes!: string | null;
}

class TripAuditEntryResponseDto {
  @ApiProperty({ format: 'date-time' }) timestamp!: string;
  @ApiProperty({ enum: TripEvent }) event!: TripEvent;
  @ApiProperty() description!: string;
}

export class TripResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() tenantId!: string;
  @ApiProperty() vehicleId!: string;
  @ApiProperty() driverId!: string;
  @ApiProperty({ nullable: true }) appointmentId!: string | null;
  @ApiProperty({ enum: VehicleCategory }) vehicleCategory!: VehicleCategory;
  @ApiProperty() isExternalCarrier!: boolean;
  @ApiProperty({ nullable: true }) domiciliaryId!: string | null;
  @ApiProperty({ nullable: true }) externalCarrierId!: string | null;
  @ApiProperty({ nullable: true }) externalVehicleId!: string | null;
  @ApiProperty({ nullable: true }) originWarehouseId!: string | null;
  @ApiProperty({ type: TripLocationDto }) origin!: TripLocationDto;
  @ApiProperty({ type: TripLocationDto }) destination!: TripLocationDto;
  @ApiProperty({ type: [TripStopResponseDto] }) stops!: TripStopResponseDto[];
  @ApiProperty({ nullable: true, format: 'date-time' }) startedAt!: string | null;
  @ApiProperty({ nullable: true, format: 'date-time' }) estimatedArrival!: string | null;
  @ApiProperty({ nullable: true, format: 'date-time' }) actualArrival!: string | null;
  @ApiPropertyOptional({ nullable: true }) currentLat!: number | null;
  @ApiPropertyOptional({ nullable: true }) currentLng!: number | null;
  @ApiProperty({ enum: TripStatus }) status!: TripStatus;
  @ApiProperty() checklistComplied!: boolean;
  @ApiProperty({ type: [TripAuditEntryResponseDto] }) auditLog!: TripAuditEntryResponseDto[];
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;
}

export class ListTripsResponseDto {
  @ApiProperty({ type: [TripResponseDto] }) items!: TripResponseDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
}
