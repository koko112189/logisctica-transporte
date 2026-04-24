import type { User } from '../entities/user.entity';

export interface UserRepositoryPort {
  save(user: User): Promise<void>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  listByTenantId(
    tenantId: string,
    skip: number,
    limit: number,
  ): Promise<{ items: User[]; total: number }>;
  listAll(
    skip: number,
    limit: number,
  ): Promise<{ items: User[]; total: number }>;
}
