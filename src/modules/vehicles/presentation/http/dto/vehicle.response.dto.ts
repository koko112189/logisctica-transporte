import { ApiProperty } from '@nestjs/swagger';
import { DefectStatus } from '../../../domain/enums/defect-status.enum';
import { VehicleStatus } from '../../../domain/enums/vehicle-status.enum';
import { VehicleType } from '../../../domain/enums/vehicle-type.enum';

export class DefectResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() description!: string;
  @ApiProperty({ format: 'date-time' }) reportedAt!: string;
  @ApiProperty({ format: 'date-time', nullable: true }) resolvedAt!: string | null;
  @ApiProperty({ enum: DefectStatus, enumName: 'DefectStatus' }) status!: DefectStatus;
}

export class RepairResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() description!: string;
  @ApiProperty({ format: 'date' }) date!: string;
  @ApiProperty({ nullable: true }) cost!: number | null;
  @ApiProperty({ nullable: true }) mechanic!: string | null;
  @ApiProperty({ nullable: true }) notes!: string | null;
}

export class VehicleResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() tenantId!: string;
  @ApiProperty() licensePlate!: string;
  @ApiProperty({ enum: VehicleType, enumName: 'VehicleType' }) vehicleType!: VehicleType;
  @ApiProperty() brand!: string;
  @ApiProperty() model!: string;
  @ApiProperty() year!: number;
  @ApiProperty({ description: 'Capacidad en kg' }) capacity!: number;
  @ApiProperty({ type: [DefectResponseDto] }) defects!: DefectResponseDto[];
  @ApiProperty({ type: [RepairResponseDto] }) repairs!: RepairResponseDto[];
  @ApiProperty() observations!: string;
  @ApiProperty({ nullable: true }) linkedDriverId!: string | null;
  @ApiProperty({ enum: VehicleStatus, enumName: 'VehicleStatus' }) status!: VehicleStatus;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;
}

export class CreateVehicleResponseDto {
  @ApiProperty() vehicleId!: string;
  @ApiProperty() driverUserId!: string;
  @ApiProperty() driverEmail!: string;
  @ApiProperty({ description: 'Contraseña temporal — mostrar solo una vez' })
  driverTemporaryPassword!: string;
}

export class ListVehiclesResponseDto {
  @ApiProperty({ type: [VehicleResponseDto] }) items!: VehicleResponseDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
}
