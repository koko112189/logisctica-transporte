import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../../../shared/presentation/http/dto/pagination.query.dto';
import { AppointmentStatus } from '../../../domain/enums/appointment-status.enum';

export class ListAppointmentsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsString() vehicleId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() driverId?: string;
  @ApiPropertyOptional({ enum: AppointmentStatus, enumName: 'AppointmentStatus' })
  @IsOptional() @IsEnum(AppointmentStatus) status?: AppointmentStatus;
  @ApiPropertyOptional({ format: 'date-time' }) @IsOptional() @IsDateString() from?: string;
  @ApiPropertyOptional({ format: 'date-time' }) @IsOptional() @IsDateString() to?: string;
}
