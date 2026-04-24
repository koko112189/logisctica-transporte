import { ApiProperty } from '@nestjs/swagger';
import { ChecklistCategory } from '../../../domain/enums/checklist-category.enum';
import { ChecklistStatus } from '../../../domain/enums/checklist-status.enum';
import { ChecklistTemplate } from '../../../domain/enums/checklist-template.enum';
import { FuelLevel } from '../../../domain/enums/fuel-level.enum';
import { ItemStatus } from '../../../domain/enums/item-status.enum';

export class ChecklistItemResponseDto {
  @ApiProperty({ enum: ChecklistCategory, enumName: 'ChecklistCategory' }) category!: ChecklistCategory;
  @ApiProperty() name!: string;
  @ApiProperty({ enum: ItemStatus, enumName: 'ItemStatus' }) status!: ItemStatus;
  @ApiProperty({ nullable: true }) observation!: string | null;
}

export class ChecklistResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() tenantId!: string;
  @ApiProperty() vehicleId!: string;
  @ApiProperty() driverId!: string;
  @ApiProperty({ format: 'date' }) date!: string;
  @ApiProperty({ type: [ChecklistItemResponseDto] }) items!: ChecklistItemResponseDto[];
  @ApiProperty({ enum: FuelLevel, enumName: 'FuelLevel', nullable: true }) fuelLevel!: FuelLevel | null;
  @ApiProperty() previousTasksConfirmed!: boolean;
  @ApiProperty() generalObservations!: string;
  @ApiProperty({ enum: ChecklistTemplate, enumName: 'ChecklistTemplate' }) checklistTemplate!: ChecklistTemplate;
  @ApiProperty({ enum: ChecklistStatus, enumName: 'ChecklistStatus' }) status!: ChecklistStatus;
  @ApiProperty({ format: 'date-time', nullable: true }) submittedAt!: string | null;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
}

export class ListChecklistsResponseDto {
  @ApiProperty({ type: [ChecklistResponseDto] }) items!: ChecklistResponseDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
}
