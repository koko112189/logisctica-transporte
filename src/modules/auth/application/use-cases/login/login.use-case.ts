import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomUUID, createHash } from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import {
  InvalidCredentialsError,
  UserInactiveError,
} from '../../../domain/errors/auth.errors';
import type { RefreshTokenRepositoryPort } from '../../../domain/ports/refresh-token.repository.port';
import type { UserRepositoryPort } from '../../../../users/domain/ports/user.repository.port';
import { AUTH_REFRESH_TOKEN_REPOSITORY } from '../../../auth.di-tokens';
import { USER_REPOSITORY } from '../../../../users/users.di-tokens';
import type { JwtPayload } from '../../../domain/interfaces/jwt-payload.interface';
import { LoginCommand } from './login.command';
import { LoginResult } from './login.result';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
    @Inject(AUTH_REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    const email = command.email.trim().toLowerCase();
    const user = await this.users.findByEmail(email);
    if (!user) throw new InvalidCredentialsError();

    const passwordMatch = await bcrypt.compare(
      command.password,
      user.hashedPassword,
    );
    if (!passwordMatch) throw new InvalidCredentialsError();

    if (!user.isActive) throw new UserInactiveError();

    const payload: JwtPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      isSuperAdmin: user.isSuperAdmin,
      permissions: user.permissions.map((p) => ({
        module: p.module,
        actions: p.actions,
      })),
    };

    const accessToken = this.jwtService.sign(payload);

    const rawRefreshToken = randomUUID();
    const tokenHash = createHash('sha256')
      .update(rawRefreshToken)
      .digest('hex');
    const ttlSeconds = this.config.get<number>(
      'JWT_REFRESH_TOKEN_TTL_SECONDS',
      604800,
    );
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    const refreshTokenEntity = new RefreshToken(
      randomUUID(),
      user.id,
      user.tenantId,
      tokenHash,
      expiresAt,
      false,
      new Date(),
    );
    await this.refreshTokens.save(refreshTokenEntity);

    return new LoginResult(accessToken, rawRefreshToken);
  }
}
