import {
  Body,
  Controller,
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
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Action } from '../../../../shared/domain/enums/action.enum';
import { TmsModule } from '../../../../shared/domain/enums/tms-module.enum';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../../../shared/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../shared/presentation/guards/permissions.guard';
import { TenantGuard } from '../../../../shared/presentation/guards/tenant.guard';
import { SWAGGER_JWT_AUTH } from '../../../../shared/presentation/swagger/swagger.constants';
import type { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface';
import { AssignVehicleToDriverCommand } from '../../application/use-cases/assign-vehicle-to-driver/assign-vehicle-to-driver.command';
import { AssignVehicleToDriverUseCase } from '../../application/use-cases/assign-vehicle-to-driver/assign-vehicle-to-driver.use-case';
import { CreateDriverProfileCommand } from '../../application/use-cases/create-driver-profile/create-driver-profile.command';
import { CreateDriverProfileUseCase } from '../../application/use-cases/create-driver-profile/create-driver-profile.use-case';
import { CreateDriverSurveyCommand } from '../../application/use-cases/create-driver-survey/create-driver-survey.command';
import { CreateDriverSurveyUseCase } from '../../application/use-cases/create-driver-survey/create-driver-survey.use-case';
import { GetDriverProfileQuery } from '../../application/use-cases/get-driver-profile/get-driver-profile.query';
import { GetDriverProfileUseCase } from '../../application/use-cases/get-driver-profile/get-driver-profile.use-case';
import { GetDriverSurveyByIdQuery } from '../../application/use-cases/get-driver-survey-by-id/get-driver-survey-by-id.query';
import { GetDriverSurveyByIdUseCase } from '../../application/use-cases/get-driver-survey-by-id/get-driver-survey-by-id.use-case';
import { GetPendingSurveysForDriverQuery } from '../../application/use-cases/get-pending-surveys-for-driver/get-pending-surveys-for-driver.query';
import { GetPendingSurveysForDriverUseCase } from '../../application/use-cases/get-pending-surveys-for-driver/get-pending-surveys-for-driver.use-case';
import { ListDriverProfilesQuery } from '../../application/use-cases/list-driver-profiles/list-driver-profiles.query';
import { ListDriverProfilesUseCase } from '../../application/use-cases/list-driver-profiles/list-driver-profiles.use-case';
import { ListDriverSurveysQuery } from '../../application/use-cases/list-driver-surveys/list-driver-surveys.query';
import { ListDriverSurveysUseCase } from '../../application/use-cases/list-driver-surveys/list-driver-surveys.use-case';
import { SubmitDriverSurveyCommand } from '../../application/use-cases/submit-driver-survey/submit-driver-survey.command';
import { SubmitDriverSurveyUseCase } from '../../application/use-cases/submit-driver-survey/submit-driver-survey.use-case';
import { DeliveredItem } from '../../domain/value-objects/delivered-item.vo';
import { Incident } from '../../domain/value-objects/incident.vo';
import { CreateDriverProfileRequestDto } from './dto/create-driver-profile.request.dto';
import { SubmitDriverSurveyRequestDto } from './dto/submit-driver-survey.request.dto';
import {
  DriverProfileResponseDto,
  DriverSurveyResponseDto,
  ListDriverProfilesResponseDto,
} from './dto/driver.response.dto';

class PaginationQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string)) page?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string)) limit?: number;
}

@ApiTags('Drivers')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@Controller('drivers')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class DriversController {
  constructor(
    private readonly createProfile: CreateDriverProfileUseCase,
    private readonly updateProfile: AssignVehicleToDriverUseCase,
    private readonly getProfile: GetDriverProfileUseCase,
    private readonly listProfiles: ListDriverProfilesUseCase,
    private readonly createSurvey: CreateDriverSurveyUseCase,
    private readonly submitSurvey: SubmitDriverSurveyUseCase,
    private readonly getSurveyById: GetDriverSurveyByIdUseCase,
    private readonly listSurveys: ListDriverSurveysUseCase,
    private readonly getPending: GetPendingSurveysForDriverUseCase,
  ) {}

  private requireTenantId(caller: JwtPayload): string {
    if (!caller.tenantId) throw new ForbiddenException('Operación requiere contexto de empresa');
    return caller.tenantId;
  }

  @Post()
  @RequirePermissions({ module: TmsModule.DRIVERS, action: Action.WRITE })
  @ApiOperation({ summary: 'Crear perfil de conductor' })
  @ApiCreatedResponse({ schema: { properties: { profileId: { type: 'string' } } } })
  async create(
    @CurrentUser() caller: JwtPayload,
    @Body() body: CreateDriverProfileRequestDto,
  ): Promise<{ profileId: string }> {
    const tenantId = this.requireTenantId(caller);
    return this.createProfile.execute(
      new CreateDriverProfileCommand(tenantId, body.userId, body.licenseNumber, new Date(body.licenseExpiry)),
    );
  }

  @Get()
  @RequirePermissions({ module: TmsModule.DRIVERS, action: Action.READ })
  @ApiOperation({ summary: 'Listar perfiles de conductor' })
  @ApiOkResponse({ type: ListDriverProfilesResponseDto })
  async list(
    @CurrentUser() caller: JwtPayload,
    @Query() query: PaginationQueryDto,
  ): Promise<ListDriverProfilesResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const result = await this.listProfiles.execute(
      new ListDriverProfilesQuery(tenantId, query.page ?? 1, query.limit ?? 50),
    );
    return {
      items: result.items.map((p) => ({
        id: p.id, tenantId: p.tenantId, userId: p.userId,
        licenseNumber: p.licenseNumber, licenseExpiry: p.licenseExpiry.toISOString(),
        assignedVehicleId: p.assignedVehicleId, isActive: p.isActive,
        createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
      })),
      total: result.total,
      page: query.page ?? 1,
      limit: query.limit ?? 50,
    };
  }

  @Get('surveys/pending')
  @RequirePermissions({ module: TmsModule.DRIVERS, action: Action.READ })
  @ApiOperation({ summary: 'Encuestas pendientes del conductor autenticado' })
  @ApiOkResponse({ type: [DriverSurveyResponseDto] })
  async pendingSurveys(@CurrentUser() caller: JwtPayload): Promise<DriverSurveyResponseDto[]> {
    const tenantId = this.requireTenantId(caller);
    const surveys = await this.getPending.execute(
      new GetPendingSurveysForDriverQuery(caller.sub, tenantId),
    );
    return surveys.map((s) => this.toSurveyDto(s));
  }

  @Get(':id')
  @RequirePermissions({ module: TmsModule.DRIVERS, action: Action.READ })
  @ApiOperation({ summary: 'Obtener perfil de conductor por id' })
  @ApiOkResponse({ type: DriverProfileResponseDto })
  async getById(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
  ): Promise<DriverProfileResponseDto> {
    const tenantId = this.requireTenantId(caller);
    const p = await this.getProfile.execute(new GetDriverProfileQuery(id, tenantId));
    return {
      id: p.id, tenantId: p.tenantId, userId: p.userId,
      licenseNumber: p.licenseNumber, licenseExpiry: p.licenseExpiry.toISOString(),
      assignedVehicleId: p.assignedVehicleId, isActive: p.isActive,
      createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString(),
    };
  }

  @Patch(':id/assign-vehicle')
  @RequirePermissions({ module: TmsModule.DRIVERS, action: Action.WRITE })
  @ApiOperation({ summary: 'Asignar vehículo al conductor' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async assignVehicle(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Body() body: { vehicleId: string },
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.updateProfile.execute(new AssignVehicleToDriverCommand(id, tenantId, body.vehicleId));
  }

  @Post(':id/surveys')
  @RequirePermissions({ module: TmsModule.DRIVERS, action: Action.WRITE })
  @ApiOperation({ summary: 'Crear encuesta diaria para conductor' })
  @ApiCreatedResponse({ schema: { properties: { surveyId: { type: 'string' } } } })
  async createSurveyForDriver(
    @CurrentUser() caller: JwtPayload,
    @Param('id') driverId: string,
    @Body() body: { vehicleId: string; date: string },
  ): Promise<{ surveyId: string }> {
    const tenantId = this.requireTenantId(caller);
    return this.createSurvey.execute(
      new CreateDriverSurveyCommand(tenantId, driverId, body.vehicleId, body.date),
    );
  }

  @Get(':id/surveys')
  @RequirePermissions({ module: TmsModule.DRIVERS, action: Action.READ })
  @ApiOperation({ summary: 'Listar encuestas de conductor' })
  @ApiOkResponse({ type: [DriverSurveyResponseDto] })
  async listSurveysForDriver(
    @CurrentUser() caller: JwtPayload,
    @Param('id') driverId: string,
    @Query() query: PaginationQueryDto,
  ): Promise<{ items: DriverSurveyResponseDto[]; total: number }> {
    const tenantId = this.requireTenantId(caller);
    const result = await this.listSurveys.execute(
      new ListDriverSurveysQuery(tenantId, query.page ?? 1, query.limit ?? 50, driverId),
    );
    return { items: result.items.map((s) => this.toSurveyDto(s)), total: result.total };
  }

  @Patch(':id/surveys/:surveyId/submit')
  @RequirePermissions({ module: TmsModule.DRIVERS, action: Action.WRITE })
  @ApiOperation({ summary: 'Enviar encuesta diaria' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async submitSurveyEndpoint(
    @CurrentUser() caller: JwtPayload,
    @Param('surveyId') surveyId: string,
    @Body() body: SubmitDriverSurveyRequestDto,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.submitSurvey.execute(
      new SubmitDriverSurveyCommand(
        surveyId, tenantId,
        body.vehicleState,
        body.deliveredItems.map((i) => new DeliveredItem(i.name, i.quantity, i.unit ?? null, i.confirmed, i.observations ?? null)),
        body.incidents.map((i) => new Incident(i.type, i.description, i.severity)),
        body.chemicalsHandled,
        body.chemicalsDelivered ?? null,
        body.observations,
      ),
    );
  }

  private toSurveyDto(s: import('../../domain/entities/driver-survey.entity').DriverSurvey): DriverSurveyResponseDto {
    return {
      id: s.id, tenantId: s.tenantId, driverId: s.driverId, vehicleId: s.vehicleId, date: s.date,
      vehicleState: s.vehicleState,
      deliveredItems: s.deliveredItems.map((i) => ({ name: i.name, quantity: i.quantity, unit: i.unit, confirmed: i.confirmed, observations: i.observations })),
      incidents: s.incidents.map((i) => ({ type: i.type, description: i.description, severity: i.severity })),
      chemicalsHandled: s.chemicalsHandled, chemicalsDelivered: s.chemicalsDelivered,
      observations: s.observations, status: s.status,
      submittedAt: s.submittedAt?.toISOString() ?? null,
      createdAt: s.createdAt.toISOString(),
    };
  }
}
