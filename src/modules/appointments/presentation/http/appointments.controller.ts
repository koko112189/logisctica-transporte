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
import { CancelAppointmentCommand } from '../../application/use-cases/cancel-appointment/cancel-appointment.command';
import { CancelAppointmentUseCase } from '../../application/use-cases/cancel-appointment/cancel-appointment.use-case';
import { CompleteAppointmentCommand } from '../../application/use-cases/complete-appointment/complete-appointment.command';
import { CompleteAppointmentUseCase } from '../../application/use-cases/complete-appointment/complete-appointment.use-case';
import { CreateAppointmentUseCase } from '../../application/use-cases/create-appointment/create-appointment.use-case';
import { GetAppointmentByIdQuery } from '../../application/use-cases/get-appointment-by-id/get-appointment-by-id.query';
import { GetAppointmentByIdUseCase } from '../../application/use-cases/get-appointment-by-id/get-appointment-by-id.use-case';
import { GetUpcomingForDriverQuery } from '../../application/use-cases/get-upcoming-appointments-for-driver/get-upcoming-for-driver.query';
import { GetUpcomingForDriverUseCase } from '../../application/use-cases/get-upcoming-appointments-for-driver/get-upcoming-for-driver.use-case';
import { ListAppointmentsQuery } from '../../application/use-cases/list-appointments/list-appointments.query';
import { ListAppointmentsUseCase } from '../../application/use-cases/list-appointments/list-appointments.use-case';
import { StartAppointmentCommand } from '../../application/use-cases/start-appointment/start-appointment.command';
import { StartAppointmentUseCase } from '../../application/use-cases/start-appointment/start-appointment.use-case';
import { UpdateAppointmentUseCase } from '../../application/use-cases/update-appointment/update-appointment.use-case';
import { CreateAppointmentRequestDto } from './dto/create-appointment.request.dto';
import { ListAppointmentsQueryDto } from './dto/list-appointments.query.dto';
import { UpdateAppointmentRequestDto } from './dto/update-appointment.request.dto';
import {
  AppointmentResponseDto,
  ListAppointmentsResponseDto,
} from './dto/appointment.response.dto';
import { AppointmentsHttpMapper } from './appointments.mapper';

@ApiTags('Appointments')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@Controller('appointments')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class AppointmentsController {
  constructor(
    private readonly createAppt: CreateAppointmentUseCase,
    private readonly updateAppt: UpdateAppointmentUseCase,
    private readonly cancelAppt: CancelAppointmentUseCase,
    private readonly startAppt: StartAppointmentUseCase,
    private readonly completeAppt: CompleteAppointmentUseCase,
    private readonly getApptById: GetAppointmentByIdUseCase,
    private readonly listAppts: ListAppointmentsUseCase,
    private readonly getUpcomingForDriver: GetUpcomingForDriverUseCase,
    private readonly mapper: AppointmentsHttpMapper,
  ) {}

  private requireTenantId(caller: JwtPayload): string {
    if (!caller.tenantId) throw new ForbiddenException('Operación requiere contexto de empresa');
    return caller.tenantId;
  }

  @Post()
  @RequirePermissions({ module: TmsModule.APPOINTMENTS, action: Action.WRITE })
  @ApiOperation({ summary: 'Crear cita / asignar ruta a vehículo' })
  @ApiCreatedResponse({ schema: { properties: { appointmentId: { type: 'string' } } } })
  async create(
    @CurrentUser() caller: JwtPayload,
    @Body() body: CreateAppointmentRequestDto,
  ): Promise<{ appointmentId: string }> {
    const tenantId = this.requireTenantId(caller);
    const result = await this.createAppt.execute(
      this.mapper.toCreateCommand(tenantId, body),
    );
    return { appointmentId: result.appointmentId };
  }

  @Get('driver/upcoming')
  @RequirePermissions({ module: TmsModule.APPOINTMENTS, action: Action.READ })
  @ApiOperation({ summary: 'Próximas citas del conductor autenticado' })
  @ApiOkResponse({ type: [AppointmentResponseDto] })
  async upcoming(@CurrentUser() caller: JwtPayload): Promise<AppointmentResponseDto[]> {
    const tenantId = this.requireTenantId(caller);
    const items = await this.getUpcomingForDriver.execute(
      new GetUpcomingForDriverQuery(caller.sub, tenantId),
    );
    return items.map((a) => this.mapper.toResponse(a));
  }

  @Get()
  @RequirePermissions({ module: TmsModule.APPOINTMENTS, action: Action.READ })
  @ApiOperation({ summary: 'Listar citas (vista calendario)' })
  @ApiOkResponse({ type: ListAppointmentsResponseDto })
  async list(
    @CurrentUser() caller: JwtPayload,
    @Query() query: ListAppointmentsQueryDto,
  ): Promise<ListAppointmentsResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const result = await this.listAppts.execute(
      new ListAppointmentsQuery(
        tenantId,
        query.page ?? 1,
        query.limit ?? 50,
        query.vehicleId,
        query.driverId,
        query.status,
        query.from ? new Date(query.from) : undefined,
        query.to ? new Date(query.to) : undefined,
      ),
    );
    return {
      items: result.items.map((a) => this.mapper.toResponse(a)),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get(':id')
  @RequirePermissions({ module: TmsModule.APPOINTMENTS, action: Action.READ })
  @ApiOperation({ summary: 'Obtener cita por id' })
  @ApiOkResponse({ type: AppointmentResponseDto })
  async getById(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
  ): Promise<AppointmentResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const appt = await this.getApptById.execute(new GetAppointmentByIdQuery(id, tenantId));
    return this.mapper.toResponse(appt);
  }

  @Patch(':id')
  @RequirePermissions({ module: TmsModule.APPOINTMENTS, action: Action.WRITE })
  @ApiOperation({ summary: 'Actualizar cita (re-notifica si cambia fecha)' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async update(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Body() body: UpdateAppointmentRequestDto,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.updateAppt.execute(this.mapper.toUpdateCommand(id, tenantId, body));
  }

  @Delete(':id')
  @RequirePermissions({ module: TmsModule.APPOINTMENTS, action: Action.MANAGE })
  @ApiOperation({ summary: 'Cancelar cita' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async cancel(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.cancelAppt.execute(new CancelAppointmentCommand(id, tenantId));
  }

  @Patch(':id/start')
  @RequirePermissions({ module: TmsModule.APPOINTMENTS, action: Action.WRITE })
  @ApiOperation({ summary: 'Marcar cita como en progreso' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async start(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.startAppt.execute(new StartAppointmentCommand(id, tenantId));
  }

  @Patch(':id/complete')
  @RequirePermissions({ module: TmsModule.APPOINTMENTS, action: Action.WRITE })
  @ApiOperation({ summary: 'Marcar cita como completada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async complete(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.completeAppt.execute(new CompleteAppointmentCommand(id, tenantId));
  }
}
