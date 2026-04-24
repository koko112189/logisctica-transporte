import {
  Body,
  Controller,
  ForbiddenException,
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
import { CreateUserUseCase } from '../../application/use-cases/create-user/create-user.use-case';
import { GetUserByIdUseCase } from '../../application/use-cases/get-user-by-id/get-user-by-id.use-case';
import { ListUsersQuery } from '../../application/use-cases/list-users/list-users.query';
import { ListUsersUseCase } from '../../application/use-cases/list-users/list-users.use-case';
import { JwtAuthGuard } from '../../../../shared/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../shared/presentation/guards/permissions.guard';
import { TenantGuard } from '../../../../shared/presentation/guards/tenant.guard';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { Action } from '../../../../shared/domain/enums/action.enum';
import { TmsModule } from '../../../../shared/domain/enums/tms-module.enum';
import { CreatedIdResponseDto } from '../../../../shared/presentation/swagger/created-id.response.dto';
import { SWAGGER_JWT_AUTH } from '../../../../shared/presentation/swagger/swagger.constants';
import type { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface';
import { CreateUserRequestDto } from './dto/create-user.request.dto';
import { ListUsersQueryDto } from './dto/list-users.query.dto';
import { ListUsersResponseDto } from './dto/list-users.response.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { UsersHttpMapper } from './users.mapper';

@ApiTags('Users')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@Controller('users')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class UsersController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly getUserById: GetUserByIdUseCase,
    private readonly listUsers: ListUsersUseCase,
    private readonly mapper: UsersHttpMapper,
  ) {}

  @Post()
  @RequirePermissions({ module: TmsModule.USERS, action: Action.WRITE })
  @ApiOperation({ summary: 'Crear usuario en el tenant actual' })
  @ApiCreatedResponse({ type: CreatedIdResponseDto })
  async create(
    @CurrentUser() caller: JwtPayload,
    @Body() body: CreateUserRequestDto,
  ): Promise<{ id: string }> {
    const result = await this.createUser.execute(
      this.mapper.toCreateCommand(caller.tenantId!, body),
    );
    return { id: result.id };
  }

  @Get()
  @RequirePermissions({ module: TmsModule.USERS, action: Action.READ })
  @ApiOperation({
    summary: 'Listar usuarios',
    description:
      'Usuario normal: solo su tenant. Super admin sin tenantId en query: todos los tenants; con tenantId: filtra por ese tenant.',
  })
  @ApiOkResponse({ type: ListUsersResponseDto })
  async list(
    @CurrentUser() caller: JwtPayload,
    @Query() query: ListUsersQueryDto,
  ): Promise<ListUsersResponseDto> {
    let listAllUsers = false;
    let tenantId: string | null = null;

    if (caller.isSuperAdmin) {
      if (query.tenantId) {
        tenantId = query.tenantId;
      } else {
        listAllUsers = true;
      }
    } else {
      tenantId = caller.tenantId ?? null;
      if (!tenantId) {
        throw new ForbiddenException('No perteneces a ninguna empresa');
      }
    }

    const result = await this.listUsers.execute(
      new ListUsersQuery(
        query.page ?? 1,
        query.limit ?? 20,
        tenantId,
        listAllUsers,
      ),
    );

    return {
      items: result.items.map((u) => this.mapper.toResponse(u)),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get(':id')
  @RequirePermissions({ module: TmsModule.USERS, action: Action.READ })
  @ApiOperation({ summary: 'Obtener usuario por id' })
  @ApiOkResponse({ type: UserResponseDto })
  async getById(@Param('id') id: string): Promise<UserResponseDto> {
    const user = await this.getUserById.execute(this.mapper.toGetByIdQuery(id));
    return this.mapper.toResponse(user);
  }
}
