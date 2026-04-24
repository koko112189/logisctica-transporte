import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../../../shared/presentation/http/dto/pagination.query.dto';
import { VehicleStatus } from '../../../domain/enums/vehicle-status.enum';
import { VehicleType } from '../../../domain/enums/vehicle-type.enum';

export class ListVehiclesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: VehicleType, enumName: 'VehicleType' })
  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;

  @ApiPropertyOptional({ enum: VehicleStatus, enumName: 'VehicleStatus' })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}
