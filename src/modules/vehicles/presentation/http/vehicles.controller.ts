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
import { AddDefectUseCase } from '../../application/use-cases/add-defect/add-defect.use-case';
import { AddRepairUseCase } from '../../application/use-cases/add-repair/add-repair.use-case';
import { CreateVehicleUseCase } from '../../application/use-cases/create-vehicle/create-vehicle.use-case';
import { DeactivateVehicleCommand } from '../../application/use-cases/deactivate-vehicle/deactivate-vehicle.command';
import { DeactivateVehicleUseCase } from '../../application/use-cases/deactivate-vehicle/deactivate-vehicle.use-case';
import { GetVehicleByIdQuery } from '../../application/use-cases/get-vehicle-by-id/get-vehicle-by-id.query';
import { GetVehicleByIdUseCase } from '../../application/use-cases/get-vehicle-by-id/get-vehicle-by-id.use-case';
import { ListVehiclesQuery } from '../../application/use-cases/list-vehicles/list-vehicles.query';
import { ListVehiclesUseCase } from '../../application/use-cases/list-vehicles/list-vehicles.use-case';
import { ResolveDefectCommand } from '../../application/use-cases/resolve-defect/resolve-defect.command';
import { ResolveDefectUseCase } from '../../application/use-cases/resolve-defect/resolve-defect.use-case';
import { AddDefectRequestDto } from './dto/add-defect.request.dto';
import { AddRepairRequestDto } from './dto/add-repair.request.dto';
import { CreateVehicleRequestDto } from './dto/create-vehicle.request.dto';
import { ListVehiclesQueryDto } from './dto/list-vehicles.query.dto';
import { UpdateVehicleRequestDto } from './dto/update-vehicle.request.dto';
import {
  CreateVehicleResponseDto,
  ListVehiclesResponseDto,
  VehicleResponseDto,
} from './dto/vehicle.response.dto';
import { VehiclesHttpMapper } from './vehicles.mapper';
import { UpdateVehicleUseCase } from '../../application/use-cases/update-vehicle/update-vehicle.use-case';

@ApiTags('Vehicles')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@Controller('vehicles')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class VehiclesController {
  constructor(
    private readonly createVehicle: CreateVehicleUseCase,
    private readonly updateVehicle: UpdateVehicleUseCase,
    private readonly deactivateVehicle: DeactivateVehicleUseCase,
    private readonly getVehicleById: GetVehicleByIdUseCase,
    private readonly listVehicles: ListVehiclesUseCase,
    private readonly addDefect: AddDefectUseCase,
    private readonly resolveDefectUc: ResolveDefectUseCase,
    private readonly addRepair: AddRepairUseCase,
    private readonly mapper: VehiclesHttpMapper,
  ) {}

  private requireTenantId(caller: JwtPayload): string {
    if (!caller.tenantId) throw new ForbiddenException('Operación requiere contexto de empresa');
    return caller.tenantId;
  }

  @Post()
  @RequirePermissions({ module: TmsModule.VEHICLES, action: Action.WRITE })
  @ApiOperation({ summary: 'Registrar vehículo y auto-crear credenciales de conductor' })
  @ApiCreatedResponse({ type: CreateVehicleResponseDto })
  async create(
    @CurrentUser() caller: JwtPayload,
    @Body() body: CreateVehicleRequestDto,
  ): Promise<CreateVehicleResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const result = await this.createVehicle.execute(
      this.mapper.toCreateCommand(tenantId, body),
    );
    return {
      vehicleId: result.vehicleId,
      driverUserId: result.driverUserId,
      driverEmail: result.driverEmail,
      driverTemporaryPassword: result.driverTemporaryPassword,
    };
  }

  @Get()
  @RequirePermissions({ module: TmsModule.VEHICLES, action: Action.READ })
  @ApiOperation({ summary: 'Listar vehículos del tenant' })
  @ApiOkResponse({ type: ListVehiclesResponseDto })
  async list(
    @CurrentUser() caller: JwtPayload,
    @Query() query: ListVehiclesQueryDto,
  ): Promise<ListVehiclesResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const result = await this.listVehicles.execute(
      new ListVehiclesQuery(
        tenantId,
        query.page ?? 1,
        query.limit ?? 20,
        query.vehicleType,
        query.status,
      ),
    );
    return {
      items: result.items.map((v) => this.mapper.toResponse(v)),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get(':id')
  @RequirePermissions({ module: TmsModule.VEHICLES, action: Action.READ })
  @ApiOperation({ summary: 'Obtener vehículo por id' })
  @ApiOkResponse({ type: VehicleResponseDto })
  async getById(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
  ): Promise<VehicleResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const vehicle = await this.getVehicleById.execute(
      new GetVehicleByIdQuery(id, tenantId),
    );
    return this.mapper.toResponse(vehicle);
  }

  @Patch(':id')
  @RequirePermissions({ module: TmsModule.VEHICLES, action: Action.WRITE })
  @ApiOperation({ summary: 'Actualizar datos del vehículo' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async update(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Body() body: UpdateVehicleRequestDto,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.updateVehicle.execute(this.mapper.toUpdateCommand(id, tenantId, body));
  }

  @Delete(':id')
  @RequirePermissions({ module: TmsModule.VEHICLES, action: Action.MANAGE })
  @ApiOperation({ summary: 'Desactivar vehículo (soft delete)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async deactivate(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.deactivateVehicle.execute(
      new DeactivateVehicleCommand(id, tenantId),
    );
  }

  @Post(':id/defects')
  @RequirePermissions({ module: TmsModule.VEHICLES, action: Action.WRITE })
  @ApiOperation({ summary: 'Registrar defecto en el vehículo' })
  @ApiCreatedResponse({ schema: { properties: { defectId: { type: 'string' } } } })
  async createDefect(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Body() body: AddDefectRequestDto,
  ): Promise<{ defectId: string }> {
    const tenantId = this.requireTenantId(caller);
    return this.addDefect.execute(this.mapper.toAddDefectCommand(id, tenantId, body));
  }

  @Patch(':id/defects/:defectId/resolve')
  @RequirePermissions({ module: TmsModule.VEHICLES, action: Action.WRITE })
  @ApiOperation({ summary: 'Marcar defecto como resuelto' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async resolveDefect(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Param('defectId') defectId: string,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.resolveDefectUc.execute(
      new ResolveDefectCommand(id, tenantId, defectId),
    );
  }

  @Post(':id/repairs')
  @RequirePermissions({ module: TmsModule.VEHICLES, action: Action.WRITE })
  @ApiOperation({ summary: 'Registrar reparación en el vehículo' })
  @ApiCreatedResponse({ schema: { properties: { repairId: { type: 'string' } } } })
  async createRepair(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Body() body: AddRepairRequestDto,
  ): Promise<{ repairId: string }> {
    const tenantId = this.requireTenantId(caller);
    return this.addRepair.execute(this.mapper.toAddRepairCommand(id, tenantId, body));
  }
}
