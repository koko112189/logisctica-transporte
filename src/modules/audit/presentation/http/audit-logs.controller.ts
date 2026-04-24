import { Controller, ForbiddenException, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Action } from '../../../../shared/domain/enums/action.enum';
import { TmsModule } from '../../../../shared/domain/enums/tms-module.enum';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../../../shared/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../shared/presentation/guards/permissions.guard';
import { TenantGuard } from '../../../../shared/presentation/guards/tenant.guard';
import { SWAGGER_JWT_AUTH } from '../../../../shared/presentation/swagger/swagger.constants';
import { PaginationQueryDto } from '../../../../shared/presentation/http/dto/pagination.query.dto';
import type { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface';
import { ListAuditLogsQuery } from '../../application/use-cases/list-audit-logs/list-audit-logs.query';
import { ListAuditLogsUseCase } from '../../application/use-cases/list-audit-logs/list-audit-logs.use-case';
import { ListAuditLogsResponseDto } from './dto/list-audit-logs.response.dto';

@ApiTags('Audit')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@Controller('audit-logs')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class AuditLogsController {
  constructor(private readonly listLogs: ListAuditLogsUseCase) {}

  private requireTenantId(caller: JwtPayload): string {
    if (!caller.tenantId) throw new ForbiddenException('Operación requiere contexto de empresa');
    return caller.tenantId;
  }

  @Get()
  @RequirePermissions({ module: TmsModule.AUDIT, action: Action.READ })
  @ApiOperation({ summary: 'Listar registro de auditoría del tenant' })
  @ApiOkResponse({ type: ListAuditLogsResponseDto })
  async list(
    @CurrentUser() caller: JwtPayload,
    @Query() q: PaginationQueryDto,
  ): Promise<ListAuditLogsResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const result = await this.listLogs.execute(
      new ListAuditLogsQuery(tenantId, q.page ?? 1, q.limit ?? 50),
    );
    return {
      items: result.items.map((i) => ({
        id: i.id,
        tenantId: i.tenantId,
        eventName: i.eventName,
        payload: i.payload,
        userId: i.userId,
        createdAt: i.createdAt.toISOString(),
      })),
      total: result.total,
      page: q.page ?? 1,
      limit: q.limit ?? 50,
    };
  }
}
