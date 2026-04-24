import { Body, Controller, ForbiddenException, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
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
import { CreateDomiciliaryProfileCommand } from '../../application/use-cases/create-domiciliary-profile/create-domiciliary-profile.command';
import { CreateDomiciliaryProfileUseCase } from '../../application/use-cases/create-domiciliary-profile/create-domiciliary-profile.use-case';
import { GetDomiciliaryProfileUseCase } from '../../application/use-cases/get-domiciliary-profile/get-domiciliary-profile.use-case';
import { ListDomiciliaryProfilesUseCase } from '../../application/use-cases/list-domiciliary-profiles/list-domiciliary-profiles.use-case';
import { UpdateDomiciliaryProfileCommand } from '../../application/use-cases/update-domiciliary-profile/update-domiciliary-profile.command';
import { UpdateDomiciliaryProfileUseCase } from '../../application/use-cases/update-domiciliary-profile/update-domiciliary-profile.use-case';
import { DomiciliaryProfile } from '../../domain/entities/domiciliary-profile.entity';

class PaginationQ {
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string, 10)) page?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string, 10)) limit?: number;
}

class CreateDomiciliaryBody {
  @ApiProperty() @IsString() @IsNotEmpty() @IsUUID() userId!: string;
  @ApiProperty() @IsString() @IsNotEmpty() fullName!: string;
  @ApiProperty() @IsString() @IsNotEmpty() phone!: string;
  @ApiProperty() @IsString() @IsNotEmpty() documentId!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkedExternalVehicleId?: string;
}

class PatchDomiciliaryBody {
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() linkedExternalVehicleId?: string;
}

@ApiTags('Domiciliarios')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@Controller('domiciliaries')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class DomiciliaryController {
  constructor(
    private readonly createP: CreateDomiciliaryProfileUseCase,
    private readonly getP: GetDomiciliaryProfileUseCase,
    private readonly listP: ListDomiciliaryProfilesUseCase,
    private readonly updateP: UpdateDomiciliaryProfileUseCase,
  ) {}

  private requireTenantId(caller: JwtPayload): string {
    if (!caller.tenantId) throw new ForbiddenException('Operación requiere contexto de empresa');
    return caller.tenantId;
  }

  @Post()
  @RequirePermissions({ module: TmsModule.DOMICILIARY, action: Action.WRITE })
  @ApiOperation({ summary: 'Crear perfil de domiciliario (carga liviana / última milla)' })
  @ApiCreatedResponse()
  async create(
    @CurrentUser() caller: JwtPayload,
    @Body() body: CreateDomiciliaryBody,
  ): Promise<{ profileId: string }> {
    const tenantId = this.requireTenantId(caller);
    return this.createP.execute(
      new CreateDomiciliaryProfileCommand(
        tenantId,
        body.userId,
        body.fullName,
        body.phone,
        body.documentId,
        body.linkedExternalVehicleId ?? null,
      ),
    );
  }

  @Get()
  @RequirePermissions({ module: TmsModule.DOMICILIARY, action: Action.READ })
  @ApiOperation({ summary: 'Listar perfiles' })
  async list(
    @CurrentUser() caller: JwtPayload,
    @Query() q: PaginationQ,
    @Query('activeOnly') activeOnly?: string,
  ): Promise<unknown> {
    const tenantId = this.requireTenantId(caller);
    const r = await this.listP.execute(tenantId, q.page ?? 1, q.limit ?? 50, activeOnly === 'true');
    return { items: r.items.map(toJson), total: r.total, page: q.page ?? 1, limit: q.limit ?? 50 };
  }

  @Get(':id')
  @RequirePermissions({ module: TmsModule.DOMICILIARY, action: Action.READ })
  @ApiOperation({ summary: 'Obtener por id' })
  async get(@CurrentUser() caller: JwtPayload, @Param('id') id: string): Promise<unknown> {
    const p = await this.getP.execute(id, this.requireTenantId(caller));
    return toJson(p);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  @RequirePermissions({ module: TmsModule.DOMICILIARY, action: Action.WRITE })
  @ApiOperation({ summary: 'Actualizar perfil' })
  async patch(
    @CurrentUser() caller: JwtPayload,
    @Param('id') id: string,
    @Body() body: PatchDomiciliaryBody,
  ): Promise<void> {
    await this.updateP.execute(
      new UpdateDomiciliaryProfileCommand(
        id,
        this.requireTenantId(caller),
        body.isActive,
        body.phone,
        body.linkedExternalVehicleId,
      ),
    );
  }
}

function toJson(p: DomiciliaryProfile) {
  return {
    id: p.id,
    tenantId: p.tenantId,
    userId: p.userId,
    fullName: p.fullName,
    phone: p.phone,
    documentId: p.documentId,
    linkedExternalVehicleId: p.linkedExternalVehicleId,
    isActive: p.isActive,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}
