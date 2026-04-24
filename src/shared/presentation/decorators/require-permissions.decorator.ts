import { SetMetadata } from '@nestjs/common';
import type { Action } from '../../domain/enums/action.enum';
import type { TmsModule } from '../../domain/enums/tms-module.enum';

export const PERMISSIONS_KEY = 'required_permissions';

export interface RequiredPermission {
  module: TmsModule;
  action: Action;
}

export const RequirePermissions = (...permissions: RequiredPermission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
