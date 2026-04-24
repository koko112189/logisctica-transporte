import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../../../shared/presentation/http/dto/pagination.query.dto';
import { ChecklistStatus } from '../../../domain/enums/checklist-status.enum';

export class ListChecklistsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  vehicleId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  driverId?: string;

  @ApiPropertyOptional({ enum: ChecklistStatus, enumName: 'ChecklistStatus' })
  @IsOptional()
  @IsEnum(ChecklistStatus)
  status?: ChecklistStatus;

  @ApiPropertyOptional({ format: 'date', example: '2024-01-01' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ format: 'date', example: '2024-01-31' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
}
