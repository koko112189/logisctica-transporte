import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Action } from '../../../../shared/domain/enums/action.enum';
import { TmsModule } from '../../../../shared/domain/enums/tms-module.enum';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../../../shared/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../shared/presentation/guards/permissions.guard';
import { TenantGuard } from '../../../../shared/presentation/guards/tenant.guard';
import { SWAGGER_JWT_AUTH } from '../../../../shared/presentation/swagger/swagger.constants';
import type { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface';
import { CreatePickupPointUseCase } from '../../application/use-cases/create-pickup-point/create-pickup-point.use-case';
import { DeactivatePickupPointCommand } from '../../application/use-cases/deactivate-pickup-point/deactivate-pickup-point.command';
import { DeactivatePickupPointUseCase } from '../../application/use-cases/deactivate-pickup-point/deactivate-pickup-point.use-case';
import { GetPickupPointByIdQuery } from '../../application/use-cases/get-pickup-point-by-id/get-pickup-point-by-id.query';
import { GetPickupPointByIdUseCase } from '../../application/use-cases/get-pickup-point-by-id/get-pickup-point-by-id.use-case';
import { ListPickupPointsQuery } from '../../application/use-cases/list-pickup-points/list-pickup-points.query';
import { ListPickupPointsUseCase } from '../../application/use-cases/list-pickup-points/list-pickup-points.use-case';
import { UpdatePickupPointUseCase } from '../../application/use-cases/update-pickup-point/update-pickup-point.use-case';
import { CreatePickupPointRequestDto } from './dto/create-pickup-point.request.dto';
import { ListPickupPointsQueryDto } from './dto/list-pickup-points.query.dto';
import { UpdatePickupPointRequestDto } from './dto/update-pickup-point.request.dto';
import {
  ListPickupPointsResponseDto,
  PickupPointResponseDto,
} from './dto/pickup-point.response.dto';
import { RoutePointsHttpMapper } from './route-points.mapper';

@ApiTags('Route Points')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@Controller('route-points')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class RoutePointsController {
  constructor(
    private readonly createPoint: CreatePickupPointUseCase,
    private readonly updatePoint: UpdatePickupPointUseCase,
    private readonly deactivatePoint: DeactivatePickupPointUseCase,
    private readonly getPointById: GetPickupPointByIdUseCase,
    private readonly listPoints: ListPickupPointsUseCase,
    private readonly mapper: RoutePointsHttpMapper,
  ) {}

  private requireTenantId(caller: JwtPayload): string {
    if (!caller.tenantId) throw new ForbiddenException('Operación requiere contexto de empresa');
    return caller.tenantId;
  }

  @Post()
  @RequirePermissions({ module: TmsModule.ROUTE_POINTS, action: Action.WRITE })
  @ApiOperation({ summary: 'Crear punto de recogida/entrega' })
  @ApiCreatedResponse({ schema: { properties: { pickupPointId: { type: 'string' } } } })
  async create(
    @CurrentUser() caller: JwtPayload,
    @Body() body: CreatePickupPointRequestDto,
  ): Promise<{ pickupPointId: string }> {
    const tenantId = this.requireTenantId(caller);
    return this.createPoint.execute(this.mapper.toCreateCommand(tenantId, body));
  }

  @Get()
  @RequirePermissions({ module: TmsModule.ROUTE_POINTS, action: Action.READ })
  @ApiOperation({ summary: 'Listar puntos de recogida' })
  @ApiOkResponse({ type: ListPickupPointsResponseDto })
  async list(
    @CurrentUser() caller: JwtPayload,
    @Query() query: ListPickupPointsQueryDto,
  ): Promise<ListPickupPointsResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const result = await this.listPoints.execute(
      new ListPickupPointsQuery(
        tenantId,
        query.page ?? 1,
        query.limit ?? 50,
        query.type,
        query.city,
        query.isActive,
      ),
    );
    return {
      items: result.items.map((p) => this.mapper.toResponse(p)),
      total: result.total,
      page: query.page ?? 1,
      limit: query.limit ?? 50,
    };
  }

  @Get(':id')
  @RequirePermissions({ module: TmsModule.ROUTE_POINTS, action: Action.READ })
  @ApiOperation({ summary: 'Obtener punto de recogida por id' })
  @ApiOkResponse({ type: PickupPointResponseDto })
  async getById(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
  ): Promise<PickupPointResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const point = await this.getPointById.execute(new GetPickupPointByIdQuery(id, tenantId));
    return this.mapper.toResponse(point);
  }

  @Patch(':id')
  @RequirePermissions({ module: TmsModule.ROUTE_POINTS, action: Action.WRITE })
  @ApiOperation({ summary: 'Actualizar punto de recogida' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async update(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Body() body: UpdatePickupPointRequestDto,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.updatePoint.execute(this.mapper.toUpdateCommand(id, tenantId, body));
  }

  @Delete(':id')
  @RequirePermissions({ module: TmsModule.ROUTE_POINTS, action: Action.MANAGE })
  @ApiOperation({ summary: 'Desactivar punto de recogida' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async deactivate(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.deactivatePoint.execute(new DeactivatePickupPointCommand(id, tenantId));
  }
}
