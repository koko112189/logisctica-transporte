import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength } from 'class-validator';

export class CreateTenantRequestDto {
  @ApiProperty({ minLength: 2, example: 'Mi empresa' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({
    pattern: '^[a-z0-9-]+$',
    example: 'mi-empresa',
    description: 'Solo minúsculas, números y guiones',
  })
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'El slug solo puede contener letras minúsculas, números y guiones',
  })
  slug!: string;
}
