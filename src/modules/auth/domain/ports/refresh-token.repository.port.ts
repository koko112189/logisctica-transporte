import type { RefreshToken } from '../entities/refresh-token.entity';

export interface RefreshTokenRepositoryPort {
  save(token: RefreshToken): Promise<void>;
  findByTokenHash(hash: string): Promise<RefreshToken | null>;
  revokeAllByUserId(userId: string): Promise<void>;
  revokeByTokenHash(hash: string): Promise<void>;
}
