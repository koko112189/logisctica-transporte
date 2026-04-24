import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListAuditLogsUseCase } from './application/use-cases/list-audit-logs/list-audit-logs.use-case';
import { RecordAuditEventUseCase } from './application/use-cases/record-audit-event/record-audit-event.use-case';
import { AuditLogSchema, AuditLogSchemaClass } from './infrastructure/persistence/audit-log.schema';
import { AuditBroadcastListener } from './presentation/audit-broadcast.listener';
import { AuditLogsController } from './presentation/http/audit-logs.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: AuditLogSchemaClass.name, schema: AuditLogSchema }])],
  controllers: [AuditLogsController],
  providers: [RecordAuditEventUseCase, ListAuditLogsUseCase, AuditBroadcastListener],
  exports: [RecordAuditEventUseCase],
})
export class AuditModule {}
