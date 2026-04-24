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
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEmail, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
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
import { CreateWarehouseCommand } from '../../application/use-cases/create-warehouse/create-warehouse.command';
import { CreateWarehouseUseCase } from '../../application/use-cases/create-warehouse/create-warehouse.use-case';
import { GetWarehouseUseCase } from '../../application/use-cases/get-warehouse/get-warehouse.use-case';
import { ListWarehousesUseCase } from '../../application/use-cases/list-warehouses/list-warehouses.use-case';
import { TestWarehouseNotificationUseCase } from '../../application/use-cases/test-warehouse-notification/test-warehouse-notification.use-case';
import { UpdateWarehouseCommand } from '../../application/use-cases/update-warehouse/update-warehouse.command';
import { UpdateWarehouseUseCase } from '../../application/use-cases/update-warehouse/update-warehouse.use-case';
import { Warehouse } from '../../domain/entities/warehouse.entity';

class PaginationQ {
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string, 10)) page?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string, 10)) limit?: number;
}

class CreateWarehouseBody {
  @ApiProperty() @IsString() @IsNotEmpty() name!: string;
  @ApiProperty() @IsString() @IsNotEmpty() address!: string;
  @ApiProperty() @IsString() @IsNotEmpty() city!: string;
  @ApiProperty() @IsEmail() notificationEmail!: string;
  @ApiProperty() @IsString() @IsNotEmpty() phone!: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) lat?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) lng?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() alertOnTripDispatch?: boolean;
}

class PatchWarehouseBody {
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() city?: string;
  @ApiPropertyOptional() @IsOptional() @IsEmail() notificationEmail?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) lat?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Type(() => Number) lng?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() alertOnTripDispatch?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}

@ApiTags('Bodegas')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@Controller('warehouses')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class WarehousesController {
  constructor(
    private readonly createW: CreateWarehouseUseCase,
    private readonly listW: ListWarehousesUseCase,
    private readonly getW: GetWarehouseUseCase,
    private readonly updateW: UpdateWarehouseUseCase,
    private readonly testMail: TestWarehouseNotificationUseCase,
  ) {}

  private requireTenantId(caller: JwtPayload): string {
    if (!caller.tenantId) throw new ForbiddenException('Operación requiere contexto de empresa');
    return caller.tenantId;
  }

  @Post()
  @RequirePermissions({ module: TmsModule.WAREHOUSES, action: Action.WRITE })
  @ApiOperation({ summary: 'Registrar bodega' })
  @ApiCreatedResponse()
  async create(
    @CurrentUser() caller: JwtPayload,
    @Body() body: CreateWarehouseBody,
  ): Promise<{ warehouseId: string }> {
    const tenantId = this.requireTenantId(caller);
    return this.createW.execute(
      new CreateWarehouseCommand(
        tenantId,
        body.name,
        body.address,
        body.city,
        body.notificationEmail,
        body.phone,
        body.lat ?? null,
        body.lng ?? null,
        body.alertOnTripDispatch ?? true,
      ),
    );
  }

  @Get()
  @RequirePermissions({ module: TmsModule.WAREHOUSES, action: Action.READ })
  @ApiOperation({ summary: 'Listar bodegas' })
  async list(
    @CurrentUser() caller: JwtPayload,
    @Query() q: PaginationQ,
    @Query('activeOnly') activeOnly?: string,
  ): Promise<unknown> {
    const tenantId = this.requireTenantId(caller);
    const r = await this.listW.execute(tenantId, q.page ?? 1, q.limit ?? 50, activeOnly === 'true');
    return { items: r.items.map(toJson), total: r.total, page: q.page ?? 1, limit: q.limit ?? 50 };
  }

  @Get(':id')
  @RequirePermissions({ module: TmsModule.WAREHOUSES, action: Action.READ })
  @ApiOperation({ summary: 'Obtener bodega' })
  async get(@CurrentUser() caller: JwtPayload, @Param('id') id: string): Promise<unknown> {
    const w = await this.getW.execute(id, this.requireTenantId(caller));
    return toJson(w);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @RequirePermissions({ module: TmsModule.WAREHOUSES, action: Action.WRITE })
  @ApiOperation({ summary: 'Actualizar bodega' })
  async patch(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Body() body: PatchWarehouseBody,
  ): Promise<void> {
    await this.updateW.execute(
      new UpdateWarehouseCommand(
        id,
        this.requireTenantId(caller),
        body.name,
        body.address,
        body.city,
        body.notificationEmail,
        body.phone,
        body.lat,
        body.lng,
        body.alertOnTripDispatch,
        body.isActive,
      ),
    );
  }

  @Post(':id/test-notification')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @RequirePermissions({ module: TmsModule.WAREHOUSES, action: Action.WRITE })
  @ApiOperation({ summary: 'Enviar correo de prueba a la bodega' })
  async test(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
  ): Promise<void> {
    await this.testMail.execute(id, this.requireTenantId(caller));
  }
}

function toJson(w: Warehouse) {
  return {
    id: w.id,
    tenantId: w.tenantId,
    name: w.name,
    address: w.address,
    city: w.city,
    notificationEmail: w.notificationEmail,
    phone: w.phone,
    lat: w.coordinates?.lat ?? null,
    lng: w.coordinates?.lng ?? null,
    alertOnTripDispatch: w.alertOnTripDispatch,
    isActive: w.isActive,
    createdAt: w.createdAt.toISOString(),
    updatedAt: w.updatedAt.toISOString(),
  };
}
