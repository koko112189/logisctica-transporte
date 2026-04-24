import { Action } from '../../../../shared/domain/enums/action.enum';
import { TmsModule } from '../../../../shared/domain/enums/tms-module.enum';
import { UserRole } from '../../../../shared/domain/enums/user-role.enum';
import type { Permission } from '../../../../shared/domain/value-objects/permission.vo';

export class User {
  constructor(
    public readonly id: string,
    public readonly tenantId: string | null,
    public readonly email: string,
    public readonly name: string,
    public readonly hashedPassword: string,
    public readonly isSuperAdmin: boolean,
    public readonly isActive: boolean,
    public readonly permissions: Permission[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly role: UserRole | null = null,
  ) {}

  hasPermission(module: TmsModule, action: Action): boolean {
    if (this.isSuperAdmin) return true;
    return this.permissions.some(
      (p) => p.module === module && p.allows(action),
    );
  }
}
