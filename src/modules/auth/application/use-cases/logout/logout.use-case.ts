import { Inject, Injectable } from '@nestjs/common';
import { createHash } from 'node:crypto';
import type { RefreshTokenRepositoryPort } from '../../../domain/ports/refresh-token.repository.port';
import { AUTH_REFRESH_TOKEN_REPOSITORY } from '../../../auth.di-tokens';
import { LogoutCommand } from './logout.command';

@Injectable()
export class LogoutUseCase {
  constructor(
    @Inject(AUTH_REFRESH_TOKEN_REPOSITORY)
    private readonly refreshTokens: RefreshTokenRepositoryPort,
  ) {}

  async execute(command: LogoutCommand): Promise<void> {
    const tokenHash = createHash('sha256')
      .update(command.rawToken)
      .digest('hex');
    await this.refreshTokens.revokeByTokenHash(tokenHash);
  }
}
