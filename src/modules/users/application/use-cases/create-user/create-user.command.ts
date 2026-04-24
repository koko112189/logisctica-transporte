import type { UserRole } from '../../../../../shared/domain/enums/user-role.enum';
import type { Permission } from '../../../../../shared/domain/value-objects/permission.vo';

export class CreateUserCommand {
  constructor(
    public readonly tenantId: string,
    public readonly email: string,
    public readonly name: string,
    public readonly password: string,
    public readonly permissions: Permission[],
    public readonly role: UserRole | null = null,
  ) {}
}
