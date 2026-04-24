import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StopType } from '../../../domain/enums/stop-type.enum';
import { VehicleCategory } from '../../../domain/enums/vehicle-category.enum';

export class StopInputDto {
  @ApiProperty() @IsNumber() stopOrder!: number;
  @ApiProperty() @IsString() @IsNotEmpty() pickupPointId!: string;
  @ApiProperty({ enum: StopType }) @IsEnum(StopType) type!: StopType;
  @ApiPropertyOptional({ format: 'date-time' }) @IsOptional() @IsDateString() scheduledArrival?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

export class CreateTripRequestDto {
  @ApiProperty() @IsString() @IsNotEmpty() vehicleId!: string;
  @ApiProperty() @IsString() @IsNotEmpty() driverId!: string;
  @ApiProperty({ enum: VehicleCategory }) @IsEnum(VehicleCategory) vehicleCategory!: VehicleCategory;
  @ApiProperty() @IsString() @IsNotEmpty() originAddress!: string;
  @ApiProperty() @IsString() @IsNotEmpty() originCity!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() originLat?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() originLng?: number;
  @ApiProperty() @IsString() @IsNotEmpty() destinationAddress!: string;
  @ApiProperty() @IsString() @IsNotEmpty() destinationCity!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() destinationLat?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() destinationLng?: number;
  @ApiProperty({ type: [StopInputDto] }) @IsArray() @ValidateNested({ each: true }) @Type(() => StopInputDto) stops!: StopInputDto[];
  @ApiPropertyOptional() @IsOptional() @IsString() appointmentId?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isExternalCarrier?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() domiciliaryId?: string;
  @ApiPropertyOptional() @ValidateIf((o: CreateTripRequestDto) => o.isExternalCarrier === true) @IsString() @IsNotEmpty() externalCarrierId?: string;
  @ApiPropertyOptional() @ValidateIf((o: CreateTripRequestDto) => o.isExternalCarrier === true) @IsString() @IsNotEmpty() externalVehicleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() originWarehouseId?: string;
  @ApiPropertyOptional({ format: 'date-time' }) @IsOptional() @IsDateString() estimatedArrival?: string;
}
