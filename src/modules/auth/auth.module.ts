import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { GetMeUseCase } from './application/use-cases/get-me/get-me.use-case';
import { LoginUseCase } from './application/use-cases/login/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout/logout.use-case';
import { RefreshTokenUseCase } from './application/use-cases/refresh-token/refresh-token.use-case';
import { MongooseRefreshTokenRepository } from './infrastructure/persistence/mongoose-refresh-token.repository';
import {
  RefreshTokenSchemaClass,
  RefreshTokenSchema,
} from './infrastructure/persistence/refresh-token.schema';
import { JwtStrategy } from './infrastructure/jwt/jwt.strategy';
import { AuthController } from './presentation/http/auth.controller';
import { AUTH_REFRESH_TOKEN_REPOSITORY } from './auth.di-tokens';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get<number>('JWT_ACCESS_TOKEN_TTL_SECONDS', 900),
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: RefreshTokenSchemaClass.name, schema: RefreshTokenSchema },
    ]),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    GetMeUseCase,
    {
      provide: AUTH_REFRESH_TOKEN_REPOSITORY,
      useClass: MongooseRefreshTokenRepository,
    },
  ],
})
export class AuthModule {}
