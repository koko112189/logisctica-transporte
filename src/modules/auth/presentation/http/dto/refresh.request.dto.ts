import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class RefreshRequestDto {
  @ApiProperty({
    format: 'uuid',
    description: 'Refresh token emitido en login',
  })
  @IsString()
  @IsUUID()
  refreshToken!: string;
}
