import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { VehicleType } from '../../../domain/enums/vehicle-type.enum';

export class CreateVehicleRequestDto {
  @ApiProperty({ example: 'ABC-123' })
  @IsString()
  @MinLength(1)
  licensePlate!: string;

  @ApiProperty({ enum: VehicleType, enumName: 'VehicleType' })
  @IsEnum(VehicleType)
  vehicleType!: VehicleType;

  @ApiProperty({ example: 'Kenworth' })
  @IsString()
  @MinLength(1)
  brand!: string;

  @ApiProperty({ example: 'T680' })
  @IsString()
  @MinLength(1)
  model!: string;

  @ApiProperty({ example: 2022 })
  @IsInt()
  @Min(1990)
  @Max(2100)
  @Type(() => Number)
  year!: number;

  @ApiProperty({ example: 10000, description: 'Capacidad en kg' })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  capacity!: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observations?: string;
}
