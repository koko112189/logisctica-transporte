import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'node:crypto';
import { CoordinatesVO } from '../../../../../shared/domain/value-objects/coordinates.vo';
import { CalypsoEvents } from '../../../../../shared/events/calypso-events';
import { Warehouse } from '../../../domain/entities/warehouse.entity';
import type { WarehouseRepositoryPort } from '../../../domain/ports/warehouse.repository.port';
import { WAREHOUSE_REPOSITORY } from '../../../warehouses.di-tokens';
import { CreateWarehouseCommand } from './create-warehouse.command';

@Injectable()
export class CreateWarehouseUseCase {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly repo: WarehouseRepositoryPort,
    private readonly events: EventEmitter2,
  ) {}

  async execute(cmd: CreateWarehouseCommand): Promise<{ warehouseId: string }> {
    const now = new Date();
    const id = randomUUID();
    const coords =
      cmd.lat != null && cmd.lng != null ? new CoordinatesVO(cmd.lat, cmd.lng) : null;
    const w = new Warehouse(
      id,
      cmd.tenantId,
      cmd.name.trim(),
      cmd.address.trim(),
      cmd.city.trim(),
      cmd.notificationEmail.trim().toLowerCase(),
      cmd.phone.trim(),
      coords,
      cmd.alertOnTripDispatch,
      true,
      now,
      now,
    );
    await this.repo.save(w);
    this.events.emit(CalypsoEvents.WAREHOUSE_CREATED, {
      tenantId: cmd.tenantId,
      performedByUserId: null,
      warehouseId: id,
    });
    return { warehouseId: id };
  }
}
