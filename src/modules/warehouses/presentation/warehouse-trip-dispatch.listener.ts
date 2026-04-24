import { Inject, Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NOTIFICATION_SERVICE } from '../../../shared/domain/ports/notification.service.port';
import type { INotificationService } from '../../../shared/domain/ports/notification.service.port';
import { CalypsoEvents } from '../../../shared/events/calypso-events';
import type { WarehouseRepositoryPort } from '../domain/ports/warehouse.repository.port';
import { WAREHOUSE_REPOSITORY } from '../warehouses.di-tokens';

type TripCreatedPayload = {
  tenantId: string;
  tripId: string;
  originWarehouseId?: string | null;
  isExternalCarrier?: boolean;
};

@Injectable()
export class WarehouseTripDispatchListener {
  private readonly log = new Logger(WarehouseTripDispatchListener.name);

  constructor(
    @Inject(WAREHOUSE_REPOSITORY) private readonly warehouses: WarehouseRepositoryPort,
    @Inject(NOTIFICATION_SERVICE)
    private readonly mail: INotificationService,
  ) {}

  @OnEvent(CalypsoEvents.TRIP_CREATED, { async: true })
  async onTripCreated(payload: TripCreatedPayload): Promise<void> {
    const whId = payload.originWarehouseId;
    if (!whId) return;
    const w = await this.warehouses.findById(whId, payload.tenantId);
    if (!w || !w.isActive || !w.alertOnTripDispatch) return;
    try {
      await this.mail.sendEmail({
        to: w.notificationEmail,
        subject: 'Nuevo viaje asignado — salida de bodega',
        body: this.html(w.name, w.city, payload.tripId, Boolean(payload.isExternalCarrier)),
      });
    } catch (err) {
      this.log.error(`Email bodega ${w.id}`, err);
    }
  }

  private html(warehouse: string, city: string, tripId: string, ext: boolean): string {
    return `<h2>Salida programada</h2>
<p><strong>Bodega:</strong> ${warehouse} (${city})</p>
<p><strong>Viaje:</strong> <code>${tripId}</code></p>
${ext ? '<p><em>Vehículo externo / carga liviana.</em></p>' : ''}
<p>Revise el detalle de travesía en Calypso TMS.</p>`;
  }
}
