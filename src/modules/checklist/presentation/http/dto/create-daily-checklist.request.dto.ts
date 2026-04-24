import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, MinLength } from 'class-validator';

export class CreateDailyChecklistRequestDto {
  @ApiProperty({ example: 'uuid-del-vehiculo' })
  @IsString()
  @MinLength(1)
  vehicleId!: string;

  @ApiProperty({ format: 'date', example: '2024-01-15' })
  @IsDateString()
  date!: string;
}
