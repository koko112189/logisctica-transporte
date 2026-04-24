import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PickupPointType } from '../../../domain/enums/pickup-point-type.enum';

export class ListPickupPointsQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string)) page?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string)) limit?: number;
  @ApiPropertyOptional({ enum: PickupPointType }) @IsOptional() @IsEnum(PickupPointType) type?: PickupPointType;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() @Transform(({ value }) => value === 'true' || value === true) isActive?: boolean;
}
