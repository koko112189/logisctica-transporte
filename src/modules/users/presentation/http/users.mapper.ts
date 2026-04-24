import { Injectable } from '@nestjs/common';
import { Permission } from '../../../../shared/domain/value-objects/permission.vo';
import { CreateUserCommand } from '../../application/use-cases/create-user/create-user.command';
import { GetUserByIdQuery } from '../../application/use-cases/get-user-by-id/get-user-by-id.query';
import type { User } from '../../domain/entities/user.entity';
import type { CreateUserRequestDto } from './dto/create-user.request.dto';
import type { UserResponseDto } from './dto/user.response.dto';

@Injectable()
export class UsersHttpMapper {
  toCreateCommand(
    tenantId: string,
    dto: CreateUserRequestDto,
  ): CreateUserCommand {
    const permissions = dto.permissions.map(
      (p) => new Permission(p.module, p.actions),
    );
    return new CreateUserCommand(
      tenantId,
      dto.email,
      dto.name,
      dto.password,
      permissions,
      dto.role ?? null,
    );
  }

  toGetByIdQuery(id: string): GetUserByIdQuery {
    return new GetUserByIdQuery(id);
  }

  toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      name: user.name,
      isActive: user.isActive,
      role: user.role,
      permissions: user.permissions.map((p) => ({
        module: p.module,
        actions: p.actions,
      })),
      createdAt: user.createdAt.toISOString(),
    };
  }
}
