import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomUUID } from 'node:crypto';
import { Model } from 'mongoose';
import { AuditLogSchemaClass } from '../../../infrastructure/persistence/audit-log.schema';
import { RecordAuditEventCommand } from './record-audit-event.command';

@Injectable()
export class RecordAuditEventUseCase {
  constructor(
    @InjectModel(AuditLogSchemaClass.name)
    private readonly model: Model<AuditLogSchemaClass>,
  ) {}

  async execute(command: RecordAuditEventCommand): Promise<void> {
    const payload = { ...command.payload };
    const tenantId =
      typeof payload['tenantId'] === 'string' ? (payload['tenantId'] as string) : 'unknown';
    const userId = typeof payload['performedByUserId'] === 'string'
      ? (payload['performedByUserId'] as string)
      : null;

    await this.model.create({
      _id: randomUUID(),
      tenantId,
      eventName: command.eventName,
      payload: command.payload,
      userId,
      createdAt: new Date(),
    });
  }
}
