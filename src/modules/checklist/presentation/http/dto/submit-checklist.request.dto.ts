import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ChecklistCategory } from '../../../domain/enums/checklist-category.enum';
import { FuelLevel } from '../../../domain/enums/fuel-level.enum';
import { ItemStatus } from '../../../domain/enums/item-status.enum';

class SubmitItemDto {
  @ApiProperty({ enum: ChecklistCategory, enumName: 'ChecklistCategory' })
  @IsEnum(ChecklistCategory)
  category!: ChecklistCategory;

  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty({ enum: ItemStatus, enumName: 'ItemStatus' })
  @IsEnum(ItemStatus)
  status!: ItemStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observation?: string;
}

export class SubmitChecklistRequestDto {
  @ApiProperty({ type: [SubmitItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubmitItemDto)
  items!: SubmitItemDto[];

  @ApiProperty({ enum: FuelLevel, enumName: 'FuelLevel' })
  @IsEnum(FuelLevel)
  fuelLevel!: FuelLevel;

  @ApiProperty()
  @IsBoolean()
  previousTasksConfirmed!: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  generalObservations?: string;
}
