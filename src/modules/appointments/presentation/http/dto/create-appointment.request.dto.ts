import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class LocationInputDto {
  @ApiProperty() @IsString() @MinLength(1) address!: string;
  @ApiProperty() @IsString() @MinLength(1) city!: string;
  @ApiPropertyOptional({ example: 4.6097 }) @IsOptional() @IsNumber() lat?: number;
  @ApiPropertyOptional({ example: -74.0817 }) @IsOptional() @IsNumber() lng?: number;
}

export class CreateAppointmentRequestDto {
  @ApiProperty() @IsString() @MinLength(1) vehicleId!: string;
  @ApiProperty() @IsString() @MinLength(1) driverId!: string;
  @ApiProperty() @IsString() @MinLength(1) title!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;

  @ApiProperty({ type: LocationInputDto }) @ValidateNested() @Type(() => LocationInputDto)
  origin!: LocationInputDto;

  @ApiProperty({ type: LocationInputDto }) @ValidateNested() @Type(() => LocationInputDto)
  destination!: LocationInputDto;

  @ApiProperty({ format: 'date-time' }) @IsDateString() scheduledAt!: string;

  @ApiProperty({ example: 120 }) @IsInt() @Min(1) @Type(() => Number)
  estimatedDurationMinutes!: number;
}
