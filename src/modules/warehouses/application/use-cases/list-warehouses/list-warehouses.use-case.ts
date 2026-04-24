import { Inject, Injectable } from '@nestjs/common';
import { Warehouse } from '../../../domain/entities/warehouse.entity';
import type { WarehouseRepositoryPort } from '../../../domain/ports/warehouse.repository.port';
import { WAREHOUSE_REPOSITORY } from '../../../warehouses.di-tokens';

@Injectable()
export class ListWarehousesUseCase {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly repo: WarehouseRepositoryPort,
  ) {}

  async execute(
    tenantId: string,
    page: number,
    limit: number,
    activeOnly: boolean,
  ): Promise<{ items: Warehouse[]; total: number }> {
    return this.repo.list(tenantId, page, limit, activeOnly);
  }
}
