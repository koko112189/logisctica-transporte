import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class LocationInputDto {
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() lat?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() lng?: number;
}

export class UpdateAppointmentRequestDto {
  @ApiPropertyOptional() @IsOptional() @IsString() title?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ type: LocationInputDto }) @IsOptional() @ValidateNested() @Type(() => LocationInputDto) origin?: LocationInputDto;
  @ApiPropertyOptional({ type: LocationInputDto }) @IsOptional() @ValidateNested() @Type(() => LocationInputDto) destination?: LocationInputDto;
  @ApiPropertyOptional({ format: 'date-time' }) @IsOptional() @IsDateString() scheduledAt?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Type(() => Number) estimatedDurationMinutes?: number;
}
