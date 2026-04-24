import { Inject, Injectable } from '@nestjs/common';
import { Warehouse } from '../../../domain/entities/warehouse.entity';
import { WarehouseNotFoundError } from '../../../domain/errors/warehouse.errors';
import type { WarehouseRepositoryPort } from '../../../domain/ports/warehouse.repository.port';
import { WAREHOUSE_REPOSITORY } from '../../../warehouses.di-tokens';

@Injectable()
export class GetWarehouseUseCase {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly repo: WarehouseRepositoryPort,
  ) {}

  async execute(id: string, tenantId: string): Promise<Warehouse> {
    const w = await this.repo.findById(id, tenantId);
    if (!w) throw new WarehouseNotFoundError();
    return w;
  }
}
