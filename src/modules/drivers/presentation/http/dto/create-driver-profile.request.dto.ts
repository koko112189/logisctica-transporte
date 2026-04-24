import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CreateDriverProfileRequestDto {
  @ApiProperty() @IsString() @IsNotEmpty() userId!: string;
  @ApiProperty() @IsString() @IsNotEmpty() licenseNumber!: string;
  @ApiProperty({ format: 'date-time' }) @IsDateString() licenseExpiry!: string;
}
