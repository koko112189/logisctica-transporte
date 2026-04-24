import { ApiProperty } from '@nestjs/swagger';

class AuditLogEntryDto {
  @ApiProperty() id!: string;
  @ApiProperty() tenantId!: string;
  @ApiProperty() eventName!: string;
  @ApiProperty({ type: 'object', additionalProperties: true }) payload!: Record<string, unknown>;
  @ApiProperty({ nullable: true }) userId!: string | null;
  @ApiProperty({ format: 'date-time' }) createdAt!: string;
}

export class ListAuditLogsResponseDto {
  @ApiProperty({ type: [AuditLogEntryDto] }) items!: AuditLogEntryDto[];
  @ApiProperty() total!: number;
  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
}
