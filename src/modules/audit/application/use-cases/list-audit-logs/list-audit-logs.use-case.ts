import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLogSchemaClass } from '../../../infrastructure/persistence/audit-log.schema';
import { AuditLogItem, ListAuditLogsResult } from './list-audit-logs.result';
import { ListAuditLogsQuery } from './list-audit-logs.query';

@Injectable()
export class ListAuditLogsUseCase {
  constructor(
    @InjectModel(AuditLogSchemaClass.name)
    private readonly model: Model<AuditLogSchemaClass>,
  ) {}

  async execute(query: ListAuditLogsQuery): Promise<ListAuditLogsResult> {
    const filter = { tenantId: query.tenantId };
    const [docs, total] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((query.page - 1) * query.limit)
        .limit(query.limit)
        .lean<AuditLogSchemaClass[]>(),
      this.model.countDocuments(filter),
    ]);
    return new ListAuditLogsResult(
      docs.map(
        (d) =>
          new AuditLogItem(
            d._id,
            d.tenantId,
            d.eventName,
            d.payload,
            d.userId,
            d.createdAt,
          ),
      ),
      total,
    );
  }
}
