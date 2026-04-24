import { Inject, Injectable } from '@nestjs/common';
import type { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../../users.di-tokens';
import { ListUsersQuery } from './list-users.query';
import { ListUsersResult } from './list-users.result';

@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {}

  async execute(query: ListUsersQuery): Promise<ListUsersResult> {
    const page = query.page > 0 ? query.page : 1;
    const limit = query.limit > 0 ? Math.min(query.limit, 100) : 20;
    const skip = (page - 1) * limit;

    if (query.listAllUsers) {
      const { items, total } = await this.users.listAll(skip, limit);
      return new ListUsersResult(items, total, page, limit);
    }

    const tenantId = query.tenantId;
    if (!tenantId) {
      return new ListUsersResult([], 0, page, limit);
    }

    const { items, total } = await this.users.listByTenantId(
      tenantId,
      skip,
      limit,
    );
    return new ListUsersResult(items, total, page, limit);
  }
}
