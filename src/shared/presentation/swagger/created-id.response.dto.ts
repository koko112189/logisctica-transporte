import { ApiProperty } from '@nestjs/swagger';

export class CreatedIdResponseDto {
  @ApiProperty({ description: 'Identificador del recurso creado' })
  id!: string;
}
