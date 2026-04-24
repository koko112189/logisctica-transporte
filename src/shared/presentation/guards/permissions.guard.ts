import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { JwtPayload } from '../../../modules/auth/domain/interfaces/jwt-payload.interface';
import { Action } from '../../domain/enums/action.enum';
import {
  PERMISSIONS_KEY,
  type RequiredPermission,
} from '../decorators/require-permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<RequiredPermission[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user = request.user;

    if (user?.isSuperAdmin) return true;

    const hasAll = required.every(({ module, action }) =>
      user?.permissions?.some(
        (p) =>
          p.module === module &&
          (p.actions.includes(action) || p.actions.includes(Action.MANAGE)),
      ),
    );

    if (!hasAll) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }

    return true;
  }
}
