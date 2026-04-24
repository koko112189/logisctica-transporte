import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
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
import { ArriveAtStopCommand } from '../../application/use-cases/arrive-at-stop/arrive-at-stop.command';
import { ArriveAtStopUseCase } from '../../application/use-cases/arrive-at-stop/arrive-at-stop.use-case';
import { CancelTripCommand } from '../../application/use-cases/cancel-trip/cancel-trip.command';
import { CancelTripUseCase } from '../../application/use-cases/cancel-trip/cancel-trip.use-case';
import { CompleteTripCommand } from '../../application/use-cases/complete-trip/complete-trip.command';
import { CompleteTripUseCase } from '../../application/use-cases/complete-trip/complete-trip.use-case';
import { CompleteStopCommand } from '../../application/use-cases/complete-stop/complete-stop.command';
import { CompleteStopUseCase } from '../../application/use-cases/complete-stop/complete-stop.use-case';
import { CreateTripUseCase } from '../../application/use-cases/create-trip/create-trip.use-case';
import { GetActiveTripForDriverQuery } from '../../application/use-cases/get-active-trip-for-driver/get-active-trip-for-driver.query';
import { GetActiveTripForDriverUseCase } from '../../application/use-cases/get-active-trip-for-driver/get-active-trip-for-driver.use-case';
import { GetTripByIdQuery } from '../../application/use-cases/get-trip-by-id/get-trip-by-id.query';
import { GetTripByIdUseCase } from '../../application/use-cases/get-trip-by-id/get-trip-by-id.use-case';
import { GetTripRouteQuery } from '../../application/use-cases/get-trip-route/get-trip-route.query';
import { GetTripRouteUseCase } from '../../application/use-cases/get-trip-route/get-trip-route.use-case';
import { ListTripsQuery } from '../../application/use-cases/list-trips/list-trips.query';
import { ListTripsUseCase } from '../../application/use-cases/list-trips/list-trips.use-case';
import { ReportDelayCommand } from '../../application/use-cases/report-delay/report-delay.command';
import { ReportDelayUseCase } from '../../application/use-cases/report-delay/report-delay.use-case';
import { StartTripCommand } from '../../application/use-cases/start-trip/start-trip.command';
import { StartTripUseCase } from '../../application/use-cases/start-trip/start-trip.use-case';
import { UpdateTripLocationCommand } from '../../application/use-cases/update-trip-location/update-trip-location.command';
import { UpdateTripLocationUseCase } from '../../application/use-cases/update-trip-location/update-trip-location.use-case';
import { CancelTripRequestDto } from './dto/cancel-trip.request.dto';
import { CreateTripRequestDto } from './dto/create-trip.request.dto';
import { ListTripsQueryDto } from './dto/list-trips.query.dto';
import { ReportDelayRequestDto } from './dto/report-delay.request.dto';
import { ListTripsResponseDto, TripResponseDto } from './dto/trip.response.dto';
import { TripsHttpMapper } from './trips.mapper';

@ApiTags('Trips')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@Controller('trips')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class TripsController {
  constructor(
    private readonly createTrip: CreateTripUseCase,
    private readonly startTripUc: StartTripUseCase,
    private readonly updateLocation: UpdateTripLocationUseCase,
    private readonly arriveAtStop: ArriveAtStopUseCase,
    private readonly completeStop: CompleteStopUseCase,
    private readonly reportDelay: ReportDelayUseCase,
    private readonly completeTrip: CompleteTripUseCase,
    private readonly cancelTripUc: CancelTripUseCase,
    private readonly getTripById: GetTripByIdUseCase,
    private readonly listTrips: ListTripsUseCase,
    private readonly getActiveForDriver: GetActiveTripForDriverUseCase,
    private readonly getTripRoute: GetTripRouteUseCase,
    private readonly mapper: TripsHttpMapper,
  ) {}

  private requireTenantId(caller: JwtPayload): string {
    if (!caller.tenantId) throw new ForbiddenException('Operación requiere contexto de empresa');
    return caller.tenantId;
  }

  @Post()
  @RequirePermissions({ module: TmsModule.TRIPS, action: Action.WRITE })
  @ApiOperation({ summary: 'Crear viaje' })
  @ApiCreatedResponse({ schema: { properties: { tripId: { type: 'string' } } } })
  async create(
    @CurrentUser() caller: JwtPayload,
    @Body() body: CreateTripRequestDto,
  ): Promise<{ tripId: string }> {
    const tenantId = this.requireTenantId(caller);
    return this.createTrip.execute(
      this.mapper.toCreateCommand(tenantId, body, caller.sub),
    );
  }

  @Get('driver/active')
  @RequirePermissions({ module: TmsModule.TRIPS, action: Action.READ })
  @ApiOperation({ summary: 'Viaje activo del conductor autenticado' })
  @ApiOkResponse({ type: TripResponseDto })
  async driverActive(@CurrentUser() caller: JwtPayload): Promise<TripResponseDto | null> {
    const tenantId = this.requireTenantId(caller);
    const trip = await this.getActiveForDriver.execute(
      new GetActiveTripForDriverQuery(caller.sub, tenantId),
    );
    return trip ? this.mapper.toResponse(trip) : null;
  }

  @Get()
  @RequirePermissions({ module: TmsModule.TRIPS, action: Action.READ })
  @ApiOperation({ summary: 'Listar viajes' })
  @ApiOkResponse({ type: ListTripsResponseDto })
  async list(
    @CurrentUser() caller: JwtPayload,
    @Query() query: ListTripsQueryDto,
  ): Promise<ListTripsResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const result = await this.listTrips.execute(
      new ListTripsQuery(
        tenantId,
        query.page ?? 1,
        query.limit ?? 50,
        query.vehicleId,
        query.driverId,
        query.status,
        query.vehicleCategory,
        query.isExternalCarrier,
        query.from ? new Date(query.from) : undefined,
        query.to ? new Date(query.to) : undefined,
      ),
    );
    return {
      items: result.items.map((t) => this.mapper.toResponse(t)),
      total: result.total,
      page: query.page ?? 1,
      limit: query.limit ?? 50,
    };
  }

  @Get(':id')
  @RequirePermissions({ module: TmsModule.TRIPS, action: Action.READ })
  @ApiOperation({ summary: 'Obtener viaje por id' })
  @ApiOkResponse({ type: TripResponseDto })
  async getById(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
  ): Promise<TripResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const trip = await this.getTripById.execute(new GetTripByIdQuery(id, tenantId));
    return this.mapper.toResponse(trip);
  }

  @Get(':id/route')
  @RequirePermissions({ module: TmsModule.TRIPS, action: Action.READ })
  @ApiOperation({ summary: 'Ruta del viaje con coordenadas de paradas' })
  async getRoute(@CurrentUser() caller: JwtPayload, @Param('id') id: string) {
    const tenantId = this.requireTenantId(caller);
    return this.getTripRoute.execute(new GetTripRouteQuery(id, tenantId));
  }

  @Patch(':id/start')
  @RequirePermissions({ module: TmsModule.TRIPS, action: Action.WRITE })
  @ApiOperation({ summary: 'Iniciar viaje (verifica checklist del día)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async start(@CurrentUser() caller: JwtPayload, @Param('id') id: string): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.startTripUc.execute(new StartTripCommand(id, tenantId));
  }

  @Patch(':id/location')
  @RequirePermissions({ module: TmsModule.TRIPS, action: Action.WRITE })
  @ApiOperation({ summary: 'Actualizar ubicación GPS del viaje' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async updateLoc(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Body() body: { lat: number; lng: number },
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.updateLocation.execute(new UpdateTripLocationCommand(id, tenantId, body.lat, body.lng));
  }

  @Patch(':id/stops/:order/arrive')
  @RequirePermissions({ module: TmsModule.TRIPS, action: Action.WRITE })
  @ApiOperation({ summary: 'Marcar llegada a parada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async arrive(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Param('order', ParseIntPipe) order: number,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.arriveAtStop.execute(new ArriveAtStopCommand(id, tenantId, order));
  }

  @Patch(':id/stops/:order/complete')
  @RequirePermissions({ module: TmsModule.TRIPS, action: Action.WRITE })
  @ApiOperation({ summary: 'Completar parada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async completeStopEndpoint(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Param('order', ParseIntPipe) order: number,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.completeStop.execute(new CompleteStopCommand(id, tenantId, order));
  }

  @Patch(':id/delay')
  @RequirePermissions({ module: TmsModule.TRIPS, action: Action.WRITE })
  @ApiOperation({ summary: 'Reportar retraso' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async delay(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Body() body: ReportDelayRequestDto,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.reportDelay.execute(
      new ReportDelayCommand(id, tenantId, body.reason, new Date(body.newEstimatedArrival)),
    );
  }

  @Patch(':id/complete')
  @RequirePermissions({ module: TmsModule.TRIPS, action: Action.WRITE })
  @ApiOperation({ summary: 'Completar viaje' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async complete(@CurrentUser() caller: JwtPayload, @Param('id') id: string): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.completeTrip.execute(new CompleteTripCommand(id, tenantId));
  }

  @Delete(':id')
  @RequirePermissions({ module: TmsModule.TRIPS, action: Action.MANAGE })
  @ApiOperation({ summary: 'Cancelar viaje' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async cancel(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Body() body: CancelTripRequestDto,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.cancelTripUc.execute(new CancelTripCommand(id, tenantId, body.reason));
  }
}
