import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../../../shared/presentation/http/dto/pagination.query.dto';

export class ListUsersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description:
      'Solo super admin: filtrar por tenant. Si se omite, lista usuarios de todos los tenants.',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  tenantId?: string;
}
