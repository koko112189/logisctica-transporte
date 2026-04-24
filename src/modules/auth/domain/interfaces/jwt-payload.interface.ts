import type { Action } from '../../../../shared/domain/enums/action.enum';
import type { TmsModule } from '../../../../shared/domain/enums/tms-module.enum';

export interface JwtPayload {
  sub: string;
  tenantId: string | null;
  isSuperAdmin: boolean;
  permissions: Array<{ module: TmsModule; actions: Action[] }>;
}
