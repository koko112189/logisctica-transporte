import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomUUID, createHash } from 'node:crypto';
import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import {
  TokenExpiredError,
  TokenInvalidError,
  UserInactiveError,
} from '../../../domain/errors/auth.errors';
import type { RefreshTokenRepositoryPort } from '../../../domain/ports/refresh-token.repository.port';
import type { UserRepositoryPort } from '../../../../users/domain/ports/user.repository.port';
import { AUTH_REFRESH_TOKEN_REPOSITORY } from '../../../auth.di-tokens';
import { USER_REPOSITORY } from '../../../../users/users.di-tokens';
import type { JwtPayload } from '../../../domain/interfaces/jwt-payload.interface';
import { RefreshTokenCommand } from './refresh-token.command';
import { RefreshTokenResult } from './refresh-token.result';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
    @Inject(AUTH_REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepositoryPort,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    const tokenHash = createHash('sha256')
      .update(command.rawToken)
      .digest('hex');
    const stored = await this.refreshTokens.findByTokenHash(tokenHash);

    if (!stored || stored.isRevoked) throw new TokenInvalidError();
    if (stored.isExpired()) throw new TokenExpiredError();

    const user = await this.users.findById(stored.userId);
    if (!user) throw new TokenInvalidError();
    if (!user.isActive) throw new UserInactiveError();

    await this.refreshTokens.revokeByTokenHash(tokenHash);

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
    const newHash = createHash('sha256').update(rawRefreshToken).digest('hex');
    const ttlSeconds = this.config.get<number>(
      'JWT_REFRESH_TOKEN_TTL_SECONDS',
      604800,
    );
    const expiresAt = new Date(Date.now() + ttlSeconds * 1000);

    await this.refreshTokens.save(
      new RefreshToken(
        randomUUID(),
        user.id,
        user.tenantId,
        newHash,
        expiresAt,
        false,
        new Date(),
      ),
    );

    return new RefreshTokenResult(accessToken, rawRefreshToken);
  }
}
