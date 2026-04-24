import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class ReportDelayRequestDto {
  @ApiProperty() @IsString() @IsNotEmpty() reason!: string;
  @ApiProperty({ format: 'date-time' }) @IsDateString() newEstimatedArrival!: string;
}
