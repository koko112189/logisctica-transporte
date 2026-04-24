import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
  @ApiProperty({ format: 'email', example: 'usuario@empresa.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ format: 'password', minLength: 8, example: '********' })
  @IsString()
  @MinLength(8)
  password!: string;
}
