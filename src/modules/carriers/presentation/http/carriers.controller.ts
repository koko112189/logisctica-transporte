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
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Action } from '../../../../shared/domain/enums/action.enum';
import { TmsModule } from '../../../../shared/domain/enums/tms-module.enum';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../../../shared/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../shared/presentation/guards/permissions.guard';
import { TenantGuard } from '../../../../shared/presentation/guards/tenant.guard';
import { SWAGGER_JWT_AUTH } from '../../../../shared/presentation/swagger/swagger.constants';
import type { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface';
import { CreateExternalCarrierCommand } from '../../application/use-cases/create-external-carrier/create-external-carrier.command';
import { CreateExternalCarrierUseCase } from '../../application/use-cases/create-external-carrier/create-external-carrier.use-case';
import { CreateExternalVehicleCommand } from '../../application/use-cases/create-external-vehicle/create-external-vehicle.command';
import { CreateExternalVehicleUseCase } from '../../application/use-cases/create-external-vehicle/create-external-vehicle.use-case';
import { GetExternalCarrierUseCase } from '../../application/use-cases/get-external-carrier/get-external-carrier.use-case';
import { ListExternalCarriersUseCase } from '../../application/use-cases/list-external-carriers/list-external-carriers.use-case';
import { ListExternalVehiclesUseCase } from '../../application/use-cases/list-external-vehicles/list-external-vehicles.use-case';
import { UpdateExternalCarrierCommand } from '../../application/use-cases/update-external-carrier/update-external-carrier.command';
import { UpdateExternalCarrierUseCase } from '../../application/use-cases/update-external-carrier/update-external-carrier.use-case';
import { LightVehicleKind } from '../../domain/enums/light-vehicle-kind.enum';

class PaginationQ {
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string, 10)) page?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string, 10)) limit?: number;
}

class CreateExternalCarrierBody {
  @ApiProperty() @IsString() @IsNotEmpty() legalName!: string;
  @ApiProperty() @IsString() @IsNotEmpty() taxId!: string;
  @ApiProperty() @IsString() @IsNotEmpty() contactName!: string;
  @ApiProperty() @IsEmail() contactEmail!: string;
  @ApiProperty() @IsString() @IsNotEmpty() phone!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

class PatchExternalCarrierBody {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() contactName?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() contactEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

class CreateExternalVehicleBody {
  @ApiProperty() @IsString() @IsNotEmpty() licensePlate!: string;
  @ApiProperty({ enum: LightVehicleKind }) @IsEnum(LightVehicleKind) kind!: LightVehicleKind;
  @ApiProperty() @IsString() @IsNotEmpty() label!: string;
  @ApiProperty() @IsNumber() @Type(() => Number) capacityKg!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
}

@ApiTags('Carriers (externos)')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@Controller('carriers')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class CarriersController {
  constructor(
    private readonly createCarrier: CreateExternalCarrierUseCase,
    private readonly listCarriers: ListExternalCarriersUseCase,
    private readonly getCarrier: GetExternalCarrierUseCase,
    private readonly updateCarrier: UpdateExternalCarrierUseCase,
    private readonly createVehicle: CreateExternalVehicleUseCase,
    private readonly listVehicles: ListExternalVehiclesUseCase,
  ) {}

  private requireTenantId(caller: JwtPayload): string {
    if (!caller.tenantId) throw new ForbiddenException('Operación requiere contexto de empresa');
    return caller.tenantId;
  }

  @Post()
  @RequirePermissions({ module: TmsModule.CARRIERS, action: Action.WRITE })
  @ApiOperation({ summary: 'Registrar portador externo' })
  @ApiCreatedResponse({ schema: { properties: { carrierId: { type: 'string' } } } })
  async create(
    @CurrentUser() caller: JwtPayload,
    @Body() body: CreateExternalCarrierBody,
  ): Promise<{ carrierId: string }> {
    const tenantId = this.requireTenantId(caller);
    return this.createCarrier.execute(
      new CreateExternalCarrierCommand(
        tenantId,
        body.legalName,
        body.taxId,
        body.contactName,
        body.contactEmail,
        body.phone,
        body.notes ?? '',
      ),
    );
  }

  @Get()
  @RequirePermissions({ module: TmsModule.CARRIERS, action: Action.READ })
  @ApiOperation({ summary: 'Listar portadores externos' })
  @ApiOkResponse()
  async list(
    @CurrentUser() caller: JwtPayload,
    @Query() q: PaginationQ,
    @Query('activeOnly') activeOnly?: string,
  ): Promise<unknown> {
    const tenantId = this.requireTenantId(caller);
    const result = await this.listCarriers.execute(
      tenantId,
      q.page ?? 1,
      q.limit ?? 50,
      activeOnly === 'true',
    );
    return { items: result.items.map(this.toCarrierJson), total: result.total, page: q.page ?? 1, limit: q.limit ?? 50 };
  }

  @Get(':id')
  @RequirePermissions({ module: TmsModule.CARRIERS, action: Action.READ })
  @ApiOperation({ summary: 'Obtener portador por id' })
  async getById(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
  ): Promise<unknown> {
    const tenantId = this.requireTenantId(caller);
    const c = await this.getCarrier.execute(id, tenantId);
    return this.toCarrierJson(c);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @RequirePermissions({ module: TmsModule.CARRIERS, action: Action.WRITE })
  @ApiOperation({ summary: 'Actualizar portador externo' })
  async patch(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Body() body: PatchExternalCarrierBody,
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.updateCarrier.execute(
      new UpdateExternalCarrierCommand(
        id,
        tenantId,
        body.isActive,
        body.contactName,
        body.contactEmail,
        body.phone,
        body.notes,
      ),
    );
  }

  @Post(':carrierId/vehicles')
  @RequirePermissions({ module: TmsModule.CARRIERS, action: Action.WRITE })
  @ApiOperation({ summary: 'Registrar vehículo de carga liviana (externo)' })
  @ApiCreatedResponse({ schema: { properties: { vehicleId: { type: 'string' } } } })
  async addVehicle(
    @CurrentUser() caller: JwtPayload,
    @Param('carrierId') carrierId: string,
    @Body() body: CreateExternalVehicleBody,
  ): Promise<{ vehicleId: string }> {
    const tenantId = this.requireTenantId(caller);
    return this.createVehicle.execute(
      new CreateExternalVehicleCommand(
        tenantId,
        carrierId,
        body.licensePlate,
        body.kind,
        body.label,
        body.capacityKg,
        body.notes ?? '',
      ),
    );
  }

  @Get(':carrierId/vehicles')
  @RequirePermissions({ module: TmsModule.CARRIERS, action: Action.READ })
  @ApiOperation({ summary: 'Listar vehículos externos del portador' })
  async listVehiclesByCarrier(
    @CurrentUser() caller: JwtPayload,
    @Param('carrierId') carrierId: string,
    @Query() q: PaginationQ,
  ): Promise<unknown> {
    const tenantId = this.requireTenantId(caller);
    const result = await this.listVehicles.execute(
      carrierId,
      tenantId,
      q.page ?? 1,
      q.limit ?? 50,
    );
    return {
      items: result.items.map((v) => this.toVehicleJson(v)),
      total: result.total,
      page: q.page ?? 1,
      limit: q.limit ?? 50,
    };
  }

  private toCarrierJson(c: import('../../domain/entities/external-carrier.entity').ExternalCarrier) {
    return {
      id: c.id,
      tenantId: c.tenantId,
      legalName: c.legalName,
      taxId: c.taxId,
      contactName: c.contactName,
      contactEmail: c.contactEmail,
      phone: c.phone,
      notes: c.notes,
      isActive: c.isActive,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    };
  }

  private toVehicleJson(v: import('../../domain/entities/external-vehicle.entity').ExternalVehicle) {
    return {
      id: v.id,
      tenantId: v.tenantId,
      carrierId: v.carrierId,
      licensePlate: v.licensePlate,
      kind: v.kind,
      label: v.label,
      capacityKg: v.capacityKg,
      isActive: v.isActive,
      notes: v.notes,
      createdAt: v.createdAt.toISOString(),
      updatedAt: v.updatedAt.toISOString(),
    };
  }
}
