import { Inject, Injectable } from '@nestjs/common';
import { CoordinatesVO } from '../../../../../shared/domain/value-objects/coordinates.vo';
import { Warehouse } from '../../../domain/entities/warehouse.entity';
import { WarehouseNotFoundError } from '../../../domain/errors/warehouse.errors';
import type { WarehouseRepositoryPort } from '../../../domain/ports/warehouse.repository.port';
import { WAREHOUSE_REPOSITORY } from '../../../warehouses.di-tokens';
import { UpdateWarehouseCommand } from './update-warehouse.command';

@Injectable()
export class UpdateWarehouseUseCase {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly repo: WarehouseRepositoryPort,
  ) {}

  async execute(cmd: UpdateWarehouseCommand): Promise<void> {
    const e = await this.repo.findById(cmd.id, cmd.tenantId);
    if (!e) throw new WarehouseNotFoundError();
    const now = new Date();
    let coords = e.coordinates;
    if (cmd.lat !== undefined && cmd.lng !== undefined) {
      coords =
        cmd.lat != null && cmd.lng != null ? new CoordinatesVO(cmd.lat, cmd.lng) : null;
    }
    const w = new Warehouse(
      e.id,
      e.tenantId,
      cmd.name !== undefined ? cmd.name.trim() : e.name,
      cmd.address !== undefined ? cmd.address.trim() : e.address,
      cmd.city !== undefined ? cmd.city.trim() : e.city,
      cmd.notificationEmail !== undefined
        ? cmd.notificationEmail.trim().toLowerCase()
        : e.notificationEmail,
      cmd.phone !== undefined ? cmd.phone.trim() : e.phone,
      coords,
      cmd.alertOnTripDispatch !== undefined ? cmd.alertOnTripDispatch : e.alertOnTripDispatch,
      cmd.isActive !== undefined ? cmd.isActive : e.isActive,
      e.createdAt,
      now,
    );
    await this.repo.save(w);
  }
}
