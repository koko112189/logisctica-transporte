import { Inject, Injectable } from '@nestjs/common';
import type { User } from '../../../../users/domain/entities/user.entity';
import { UserNotFoundError } from '../../../../users/domain/errors/user.errors';
import type { UserRepositoryPort } from '../../../../users/domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../../../users/users.di-tokens';
import { GetMeQuery } from './get-me.query';

@Injectable()
export class GetMeUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {}

  async execute(query: GetMeQuery): Promise<User> {
    const user = await this.users.findById(query.userId);
    if (!user) throw new UserNotFoundError(query.userId);
    return user;
  }
}
