import { ApiProperty } from '@nestjs/swagger';
import { PickupPointType } from '../../../domain/enums/pickup-point-type.enum';

export class CoordinatesResponseDto {
  @ApiProperty() lat!: number;
  @ApiProperty() lng!: number;
}

export class PickupPointResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() tenantId!: string;
  @ApiProperty() name!: string;
  @ApiProperty({ enum: PickupPointType, enumName: 'PickupPointType' }) type!: PickupPointType;
  @ApiProperty() address!: string;
  @ApiProperty() city!: string;
  @ApiProperty({ nullable: true }) postalCode!: string | null;
  @ApiProperty({ type: CoordinatesResponseDto, nullable: true }) coordinates!: CoordinatesResponseDto | null;
  @ApiProperty({ nullable: true }) contactName!: string | null;
  @ApiProperty({ nullable: true }) contactPhone!: string | null;
  @ApiProperty({ nullable: true }) contactEmail!: string | null;
  @ApiProperty({ nullable: true }) operatingHours!: string | null;
  @ApiProperty() isActive!: boolean;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
  @ApiProperty({ format: 'date-time' }) updatedAt!: string;
}

export class ListPickupPointsResponseDto {
  @ApiProperty({ type: [PickupPointResponseDto] }) items!: PickupPointResponseDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
}
