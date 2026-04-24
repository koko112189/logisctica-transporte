import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { TripStatus } from '../../../domain/enums/trip-status.enum';
import { VehicleCategory } from '../../../domain/enums/vehicle-category.enum';

export class ListTripsQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string)) page?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string)) limit?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() vehicleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() driverId?: string;
  @ApiPropertyOptional({ enum: TripStatus }) @IsOptional() @IsEnum(TripStatus) status?: TripStatus;
  @ApiPropertyOptional({ enum: VehicleCategory }) @IsOptional() @IsEnum(VehicleCategory) vehicleCategory?: VehicleCategory;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() @Transform(({ value }) => value === 'true' || value === true) isExternalCarrier?: boolean;
  @ApiPropertyOptional({ format: 'date-time' }) @IsOptional() @IsDateString() from?: string;
  @ApiPropertyOptional({ format: 'date-time' }) @IsOptional() @IsDateString() to?: string;
}
