import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class AddRepairRequestDto {
  @ApiProperty({ example: 'Cambio de filtro de aceite' })
  @IsString()
  @MinLength(5)
  description!: string;

  @ApiProperty({ format: 'date', example: '2024-01-15' })
  @IsDateString()
  date!: string;

  @ApiPropertyOptional({ example: 150000, description: 'Costo en pesos' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  cost?: number;

  @ApiPropertyOptional({ example: 'Taller Mecánico Central' })
  @IsOptional()
  @IsString()
  mechanic?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
