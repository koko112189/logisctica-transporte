import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { GetVehicleByIdUseCase } from '../../../../vehicles/application/use-cases/get-vehicle-by-id/get-vehicle-by-id.use-case';
import { GetVehicleByIdQuery } from '../../../../vehicles/application/use-cases/get-vehicle-by-id/get-vehicle-by-id.query';
import { DailyChecklist } from '../../../domain/entities/daily-checklist.entity';
import { ChecklistStatus } from '../../../domain/enums/checklist-status.enum';
import {
  ChecklistAlreadyExistsError,
  VehicleHasNoDriverError,
} from '../../../domain/errors/checklist.errors';
import type { ChecklistRepositoryPort } from '../../../domain/ports/checklist.repository.port';
import { CHECKLIST_REPOSITORY } from '../../../checklist.di-tokens';
import {
  buildDefaultItems,
  templateFromVehicleType,
} from '../../templates/checklist-items.template';
import { CreateDailyChecklistCommand } from './create-daily-checklist.command';
import { CreateDailyChecklistResult } from './create-daily-checklist.result';

@Injectable()
export class CreateDailyChecklistUseCase {
  constructor(
    @Inject(CHECKLIST_REPOSITORY)
    private readonly checklists: ChecklistRepositoryPort,
    private readonly getVehicle: GetVehicleByIdUseCase,
  ) {}

  async execute(
    command: CreateDailyChecklistCommand,
  ): Promise<CreateDailyChecklistResult> {
    const existing = await this.checklists.findByVehicleAndDate(
      command.vehicleId,
      command.tenantId,
      command.date,
    );
    if (existing) {
      throw new ChecklistAlreadyExistsError(command.vehicleId, command.date);
    }

    const vehicle = await this.getVehicle.execute(
      new GetVehicleByIdQuery(command.vehicleId, command.tenantId),
    );
    if (!vehicle.linkedDriverId) {
      throw new VehicleHasNoDriverError(command.vehicleId);
    }

    const template = templateFromVehicleType(vehicle.vehicleType);
    const items = buildDefaultItems(template);
    const now = new Date();
    const checklist = new DailyChecklist(
      randomUUID(),
      command.tenantId,
      command.vehicleId,
      vehicle.linkedDriverId,
      command.date,
      items,
      null,
      false,
      '',
      template,
      ChecklistStatus.PENDING,
      null,
      now,
    );
    await this.checklists.save(checklist);
    return new CreateDailyChecklistResult(checklist.id);
  }
}
