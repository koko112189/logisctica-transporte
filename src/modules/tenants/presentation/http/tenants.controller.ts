import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTenantUseCase } from '../../application/use-cases/create-tenant/create-tenant.use-case';
import { GetTenantByIdUseCase } from '../../application/use-cases/get-tenant-by-id/get-tenant-by-id.use-case';
import { ListTenantsQuery } from '../../application/use-cases/list-tenants/list-tenants.query';
import { ListTenantsUseCase } from '../../application/use-cases/list-tenants/list-tenants.use-case';
import { JwtAuthGuard } from '../../../../shared/presentation/guards/jwt-auth.guard';
import { SuperAdminGuard } from '../../../../shared/presentation/guards/super-admin.guard';
import { PaginationQueryDto } from '../../../../shared/presentation/http/dto/pagination.query.dto';
import { CreatedIdResponseDto } from '../../../../shared/presentation/swagger/created-id.response.dto';
import { SWAGGER_JWT_AUTH } from '../../../../shared/presentation/swagger/swagger.constants';
import { CreateTenantRequestDto } from './dto/create-tenant.request.dto';
import { ListTenantsResponseDto } from './dto/list-tenants.response.dto';
import { TenantResponseDto } from './dto/tenant.response.dto';
import { TenantsHttpMapper } from './tenants.mapper';

@ApiTags('Tenants')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@Controller('tenants')
@UseGuards(JwtAuthGuard, SuperAdminGuard)
export class TenantsController {
  constructor(
    private readonly createTenant: CreateTenantUseCase,
    private readonly getTenantById: GetTenantByIdUseCase,
    private readonly listTenants: ListTenantsUseCase,
    private readonly mapper: TenantsHttpMapper,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear tenant (solo super admin)' })
  @ApiCreatedResponse({ type: CreatedIdResponseDto })
  async create(@Body() body: CreateTenantRequestDto): Promise<{ id: string }> {
    const result = await this.createTenant.execute(
      this.mapper.toCreateCommand(body),
    );
    return { id: result.id };
  }

  @Get()
  @ApiOperation({ summary: 'Listar tenants (paginado)' })
  @ApiOkResponse({ type: ListTenantsResponseDto })
  async list(
    @Query() query: PaginationQueryDto,
  ): Promise<ListTenantsResponseDto> {
    const result = await this.listTenants.execute(
      new ListTenantsQuery(query.page ?? 1, query.limit ?? 20),
    );
    return {
      items: result.items.map((t) => this.mapper.toResponse(t)),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tenant por id' })
  @ApiOkResponse({ type: TenantResponseDto })
  async getById(@Param('id') id: string): Promise<TenantResponseDto> {
    const tenant = await this.getTenantById.execute(
      this.mapper.toGetByIdQuery(id),
    );
    return this.mapper.toResponse(tenant);
  }
}
