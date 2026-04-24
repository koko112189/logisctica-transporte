import { Injectable } from '@nestjs/common';
import { Tenant } from '../../domain/entities/tenant.entity';
import { CreateTenantCommand } from '../../application/use-cases/create-tenant/create-tenant.command';
import { GetTenantByIdQuery } from '../../application/use-cases/get-tenant-by-id/get-tenant-by-id.query';
import { CreateTenantRequestDto } from './dto/create-tenant.request.dto';
import { TenantResponseDto } from './dto/tenant.response.dto';

@Injectable()
export class TenantsHttpMapper {
  toCreateCommand(dto: CreateTenantRequestDto): CreateTenantCommand {
    return new CreateTenantCommand(dto.name, dto.slug);
  }

  toGetByIdQuery(id: string): GetTenantByIdQuery {
    return new GetTenantByIdQuery(id);
  }

  toResponse(tenant: Tenant): TenantResponseDto {
    const dto = new TenantResponseDto();
    dto.id = tenant.id;
    dto.name = tenant.name;
    dto.slug = tenant.slug;
    dto.isActive = tenant.isActive;
    dto.createdAt = tenant.createdAt;
    return dto;
  }
}
