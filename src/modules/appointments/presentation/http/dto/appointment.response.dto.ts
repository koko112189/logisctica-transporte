import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../../../domain/enums/appointment-status.enum';

export class LocationResponseDto {
  @ApiProperty() address!: string;
  @ApiProperty() city!: string;
  @ApiProperty({ nullable: true }) lat!: number | null;
  @ApiProperty({ nullable: true }) lng!: number | null;
}

export class AppointmentResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() tenantId!: string;
  @ApiProperty() vehicleId!: string;
  @ApiProperty() driverId!: string;
  @ApiProperty() title!: string;
  @ApiProperty() description!: string;
  @ApiProperty({ type: LocationResponseDto }) origin!: LocationResponseDto;
  @ApiProperty({ type: LocationResponseDto }) destination!: LocationResponseDto;
  @ApiProperty({ format: 'date-time' }) scheduledAt!: string;
  @ApiProperty() estimatedDurationMinutes!: number;
  @ApiProperty({ enum: AppointmentStatus, enumName: 'AppointmentStatus' }) status!: AppointmentStatus;
  @ApiProperty({ format: 'date-time', nullable: true }) notificationSentAt!: string | null;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;
}

export class ListAppointmentsResponseDto {
  @ApiProperty({ type: [AppointmentResponseDto] }) items!: AppointmentResponseDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
}
