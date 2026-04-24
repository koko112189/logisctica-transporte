import { Inject, Injectable } from '@nestjs/common';
import { NOTIFICATION_SERVICE } from '../../../../../shared/domain/ports/notification.service.port';
import type { INotificationService } from '../../../../../shared/domain/ports/notification.service.port';
import { WarehouseNotFoundError } from '../../../domain/errors/warehouse.errors';
import type { WarehouseRepositoryPort } from '../../../domain/ports/warehouse.repository.port';
import { WAREHOUSE_REPOSITORY } from '../../../warehouses.di-tokens';

@Injectable()
export class TestWarehouseNotificationUseCase {
  constructor(
    @Inject(WAREHOUSE_REPOSITORY)
    private readonly repo: WarehouseRepositoryPort,
    @Inject(NOTIFICATION_SERVICE)
    private readonly mail: INotificationService,
  ) {}

  async execute(warehouseId: string, tenantId: string): Promise<void> {
    const w = await this.repo.findById(warehouseId, tenantId);
    if (!w) throw new WarehouseNotFoundError();
    await this.mail.sendEmail({
      to: w.notificationEmail,
      subject: 'Calypso TMS — notificación de prueba (bodega)',
      body: `<p>Prueba de entrega a <strong>${w.name}</strong> (${w.city}).</p><p>Si recibe este correo, la bodega está correctamente registrada.</p>`,
    });
  }
}
