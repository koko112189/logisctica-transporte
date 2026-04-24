import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RecordAuditEventUseCase } from '../application/use-cases/record-audit-event/record-audit-event.use-case';
import { RecordAuditEventCommand } from '../application/use-cases/record-audit-event/record-audit-event.command';

const PREFIX = 'calypso.';

@Injectable()
export class AuditBroadcastListener implements OnModuleInit {
  private readonly log = new Logger(AuditBroadcastListener.name);

  constructor(
    private readonly emitter: EventEmitter2,
    private readonly recordAudit: RecordAuditEventUseCase,
  ) {}

  onModuleInit(): void {
    this.emitter.onAny((event: string | string[], value?: unknown) => {
      const eventName = Array.isArray(event) ? event.join('.') : event;
      if (!eventName.startsWith(PREFIX)) {
        return;
      }
      const payload =
        value !== undefined && value !== null && typeof value === 'object' && !Array.isArray(value)
          ? (value as Record<string, unknown>)
          : { value };
      void this.recordAudit
        .execute(new RecordAuditEventCommand(eventName, payload))
        .catch((err: unknown) => {
          this.log.error(`Fallo al persistir auditoría: ${eventName}`, err);
        });
    });
  }
}
