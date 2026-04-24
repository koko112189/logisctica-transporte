import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AddDefectRequestDto {
  @ApiProperty({ example: 'Fuga de aceite en motor' })
  @IsString()
  @MinLength(5)
  description!: string;
}
