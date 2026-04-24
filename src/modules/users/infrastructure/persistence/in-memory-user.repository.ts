import { Injectable } from '@nestjs/common';
import type { User } from '../../domain/entities/user.entity';
import type { UserRepositoryPort } from '../../domain/ports/user.repository.port';

@Injectable()
export class InMemoryUserRepository implements UserRepositoryPort {
  private readonly byId = new Map<string, User>();
  private readonly byEmail = new Map<string, User>();

  save(user: User): Promise<void> {
    this.byId.set(user.id, user);
    this.byEmail.set(user.email, user);
    return Promise.resolve();
  }

  findById(id: string): Promise<User | null> {
    return Promise.resolve(this.byId.get(id) ?? null);
  }

  findByEmail(email: string): Promise<User | null> {
    return Promise.resolve(this.byEmail.get(email) ?? null);
  }

  listByTenantId(
    tenantId: string,
    skip: number,
    limit: number,
  ): Promise<{ items: User[]; total: number }> {
    const all = [...this.byId.values()]
      .filter((u) => u.tenantId === tenantId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const total = all.length;
    const items = all.slice(skip, skip + limit);
    return Promise.resolve({ items, total });
  }

  listAll(
    skip: number,
    limit: number,
  ): Promise<{ items: User[]; total: number }> {
    const all = [...this.byId.values()].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const total = all.length;
    const items = all.slice(skip, skip + limit);
    return Promise.resolve({ items, total });
  }
}
