import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { JwtPayload } from '../../../modules/auth/domain/interfaces/jwt-payload.interface';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    if (!request.user?.isSuperAdmin) {
      throw new ForbiddenException(
        'Solo el superadmin puede ejecutar esta acción',
      );
    }
    return true;
  }
}
