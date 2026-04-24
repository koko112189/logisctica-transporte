import type { User } from '../../../domain/entities/user.entity';

export class ListUsersResult {
  constructor(
    public readonly items: User[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
