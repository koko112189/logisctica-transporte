import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { JwtPayload } from '../../../modules/auth/domain/interfaces/jwt-payload.interface';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const user = request.user;
    if (user?.isSuperAdmin) return true;
    if (!user?.tenantId) {
      throw new ForbiddenException('No perteneces a ninguna empresa');
    }
    return true;
  }
}
