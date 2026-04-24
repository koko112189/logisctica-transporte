import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { CreateDailyChecklistUseCase } from '../../application/use-cases/create-daily-checklist/create-daily-checklist.use-case';
import { CreateDailyChecklistCommand } from '../../application/use-cases/create-daily-checklist/create-daily-checklist.command';
import { GetChecklistByIdQuery } from '../../application/use-cases/get-checklist-by-id/get-checklist-by-id.query';
import { GetChecklistByIdUseCase } from '../../application/use-cases/get-checklist-by-id/get-checklist-by-id.use-case';
import { GetChecklistByVehicleAndDateQuery } from '../../application/use-cases/get-checklist-by-vehicle-and-date/get-checklist-by-vehicle-and-date.query';
import { GetChecklistByVehicleAndDateUseCase } from '../../application/use-cases/get-checklist-by-vehicle-and-date/get-checklist-by-vehicle-and-date.use-case';
import { GetPendingChecklistsForDriverQuery } from '../../application/use-cases/get-pending-checklists-for-driver/get-pending-checklists-for-driver.query';
import { GetPendingChecklistsForDriverUseCase } from '../../application/use-cases/get-pending-checklists-for-driver/get-pending-checklists-for-driver.use-case';
import { ListChecklistsQuery } from '../../application/use-cases/list-checklists/list-checklists.query';
import { ListChecklistsUseCase } from '../../application/use-cases/list-checklists/list-checklists.use-case';
import { SubmitChecklistUseCase } from '../../application/use-cases/submit-checklist/submit-checklist.use-case';
import { CreateDailyChecklistRequestDto } from './dto/create-daily-checklist.request.dto';
import { ListChecklistsQueryDto } from './dto/list-checklists.query.dto';
import { SubmitChecklistRequestDto } from './dto/submit-checklist.request.dto';
import {
  ChecklistResponseDto,
  ListChecklistsResponseDto,
} from './dto/checklist.response.dto';
import { ChecklistsHttpMapper } from './checklists.mapper';

@ApiTags('Checklists')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@Controller('checklists')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class ChecklistsController {
  constructor(
    private readonly createChecklist: CreateDailyChecklistUseCase,
    private readonly submitChecklist: SubmitChecklistUseCase,
    private readonly getChecklistById: GetChecklistByIdUseCase,
    private readonly getByVehicleAndDate: GetChecklistByVehicleAndDateUseCase,
    private readonly listChecklists: ListChecklistsUseCase,
    private readonly getPendingForDriver: GetPendingChecklistsForDriverUseCase,
    private readonly mapper: ChecklistsHttpMapper,
  ) {}

  private requireTenantId(caller: JwtPayload): string {
    if (!caller.tenantId) throw new ForbiddenException('Operación requiere contexto de empresa');
    return caller.tenantId;
  }

  @Post()
  @RequirePermissions({ module: TmsModule.CHECKLIST, action: Action.WRITE })
  @ApiOperation({ summary: 'Crear checklist diario para un vehículo' })
  @ApiCreatedResponse({ schema: { properties: { checklistId: { type: 'string' } } } })
  async create(
    @CurrentUser() caller: JwtPayload,
    @Body() body: CreateDailyChecklistRequestDto,
  ): Promise<{ checklistId: string }> {
    const tenantId = this.requireTenantId(caller);
    const result = await this.createChecklist.execute(
      new CreateDailyChecklistCommand(tenantId, body.vehicleId, body.date),
    );
    return { checklistId: result.checklistId };
  }

  @Get('pending')
  @RequirePermissions({ module: TmsModule.CHECKLIST, action: Action.WRITE })
  @ApiOperation({ summary: 'Checklists pendientes del conductor autenticado' })
  @ApiOkResponse({ type: [ChecklistResponseDto] })
  async pending(@CurrentUser() caller: JwtPayload): Promise<ChecklistResponseDto[]> {
    const tenantId = this.requireTenantId(caller);
    const items = await this.getPendingForDriver.execute(
      new GetPendingChecklistsForDriverQuery(caller.sub, tenantId),
    );
    return items.map((c) => this.mapper.toResponse(c));
  }

  @Get('vehicle/:vehicleId/date/:date')
  @RequirePermissions({ module: TmsModule.CHECKLIST, action: Action.READ })
  @ApiOperation({ summary: 'Obtener checklist por vehículo y fecha' })
  @ApiOkResponse({ type: ChecklistResponseDto })
  async getByVehicleDate(
    @CurrentUser() caller: JwtPayload,
    @Param('vehicleId') vehicleId: string,
    @Param('date') date: string,
  ): Promise<ChecklistResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const checklist = await this.getByVehicleAndDate.execute(
      new GetChecklistByVehicleAndDateQuery(vehicleId, tenantId, date),
    );
    return this.mapper.toResponse(checklist);
  }

  @Get()
  @RequirePermissions({ module: TmsModule.CHECKLIST, action: Action.READ })
  @ApiOperation({ summary: 'Listar checklists del tenant' })
  @ApiOkResponse({ type: ListChecklistsResponseDto })
  async list(
    @CurrentUser() caller: JwtPayload,
    @Query() query: ListChecklistsQueryDto,
  ): Promise<ListChecklistsResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const result = await this.listChecklists.execute(
      new ListChecklistsQuery(
        tenantId,
        query.page ?? 1,
        query.limit ?? 20,
        query.vehicleId,
        query.driverId,
        query.status,
        query.dateFrom,
        query.dateTo,
      ),
    );
    return {
      items: result.items.map((c) => this.mapper.toResponse(c)),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get(':id')
  @RequirePermissions({ module: TmsModule.CHECKLIST, action: Action.READ })
  @ApiOperation({ summary: 'Obtener checklist por id' })
  @ApiOkResponse({ type: ChecklistResponseDto })
  async getById(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
  ): Promise<ChecklistResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const checklist = await this.getChecklistById.execute(
      new GetChecklistByIdQuery(id, tenantId),
    );
    return this.mapper.toResponse(checklist);
  }

  @Post(':id/submit')
  @RequirePermissions({ module: TmsModule.CHECKLIST, action: Action.WRITE })
  @ApiOperation({ summary: 'El conductor envía el checklist completado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async submit(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Body() body: SubmitChecklistRequestDto,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.submitChecklist.execute(
      this.mapper.toSubmitCommand(id, tenantId, body),
    );
  }
}
