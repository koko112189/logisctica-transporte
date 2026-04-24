import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetMeUseCase } from '../../application/use-cases/get-me/get-me.use-case';
import { LoginUseCase } from '../../application/use-cases/login/login.use-case';
import { LogoutUseCase } from '../../application/use-cases/logout/logout.use-case';
import { RefreshTokenUseCase } from '../../application/use-cases/refresh-token/refresh-token.use-case';
import { LoginCommand } from '../../application/use-cases/login/login.command';
import { LogoutCommand } from '../../application/use-cases/logout/logout.command';
import { RefreshTokenCommand } from '../../application/use-cases/refresh-token/refresh-token.command';
import { GetMeQuery } from '../../application/use-cases/get-me/get-me.query';
import { JwtAuthGuard } from '../../../../shared/presentation/guards/jwt-auth.guard';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { SWAGGER_JWT_AUTH } from '../../../../shared/presentation/swagger/swagger.constants';
import type { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import { LoginRequestDto } from './dto/login.request.dto';
import { RefreshRequestDto } from './dto/refresh.request.dto';
import { AuthResponseDto, MeResponseDto } from './dto/auth.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiOkResponse({ type: AuthResponseDto })
  async login(@Body() body: LoginRequestDto): Promise<AuthResponseDto> {
    const result = await this.loginUseCase.execute(
      new LoginCommand(body.email, body.password),
    );
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renovar access token' })
  @ApiOkResponse({ type: AuthResponseDto })
  async refresh(@Body() body: RefreshRequestDto): Promise<AuthResponseDto> {
    const result = await this.refreshTokenUseCase.execute(
      new RefreshTokenCommand(body.refreshToken),
    );
    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth(SWAGGER_JWT_AUTH)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cerrar sesión (revoca refresh token)' })
  @ApiBody({ type: RefreshRequestDto })
  @ApiNoContentResponse()
  async logout(@Body() body: RefreshRequestDto): Promise<void> {
    await this.logoutUseCase.execute(new LogoutCommand(body.refreshToken));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth(SWAGGER_JWT_AUTH)
  @ApiOperation({ summary: 'Usuario autenticado' })
  @ApiOkResponse({ type: MeResponseDto })
  async me(@CurrentUser() caller: JwtPayload): Promise<MeResponseDto> {
    const user = await this.getMeUseCase.execute(new GetMeQuery(caller.sub));
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      isSuperAdmin: user.isSuperAdmin,
      isActive: user.isActive,
      permissions: user.permissions.map((p) => ({
        module: p.module,
        actions: p.actions,
      })),
    };
  }
}
