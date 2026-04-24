import { Injectable } from '@nestjs/common';
import type { DailyChecklist } from '../../domain/entities/daily-checklist.entity';
import { SubmitChecklistCommand } from '../../application/use-cases/submit-checklist/submit-checklist.command';
import type { SubmitChecklistRequestDto } from './dto/submit-checklist.request.dto';
import type { ChecklistResponseDto, ChecklistItemResponseDto } from './dto/checklist.response.dto';

@Injectable()
export class ChecklistsHttpMapper {
  toSubmitCommand(
    checklistId: string,
    tenantId: string,
    dto: SubmitChecklistRequestDto,
  ): SubmitChecklistCommand {
    return new SubmitChecklistCommand(
      checklistId,
      tenantId,
      dto.items.map((i) => ({
        category: i.category,
        name: i.name,
        status: i.status,
        observation: i.observation,
      })),
      dto.fuelLevel,
      dto.previousTasksConfirmed,
      dto.generalObservations ?? '',
    );
  }

  toResponse(checklist: DailyChecklist): ChecklistResponseDto {
    return {
      id: checklist.id,
      tenantId: checklist.tenantId,
      vehicleId: checklist.vehicleId,
      driverId: checklist.driverId,
      date: checklist.date,
      items: checklist.items.map((i): ChecklistItemResponseDto => ({
        category: i.category,
        name: i.name,
        status: i.status,
        observation: i.observation,
      })),
      fuelLevel: checklist.fuelLevel,
      previousTasksConfirmed: checklist.previousTasksConfirmed,
      generalObservations: checklist.generalObservations,
      checklistTemplate: checklist.checklistTemplate,
      status: checklist.status,
      submittedAt: checklist.submittedAt ? checklist.submittedAt.toISOString() : null,
      createdAt: checklist.createdAt.toISOString(),
    };
  }
}
