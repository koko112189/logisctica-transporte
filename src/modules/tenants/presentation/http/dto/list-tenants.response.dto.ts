import { ApiProperty } from '@nestjs/swagger';
import { TenantResponseDto } from './tenant.response.dto';

export class ListTenantsResponseDto {
  @ApiProperty({ type: [TenantResponseDto] })
  items!: TenantResponseDto[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;
}
