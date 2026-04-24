import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { VehicleStatus } from '../../../domain/enums/vehicle-status.enum';

export class UpdateVehicleRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1990)
  @Max(2100)
  @Type(() => Number)
  year?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  capacity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observations?: string;

  @ApiPropertyOptional({ enum: VehicleStatus, enumName: 'VehicleStatus' })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}
