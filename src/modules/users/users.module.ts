import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CreateUserUseCase } from './application/use-cases/create-user/create-user.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id/get-user-by-id.use-case';
import { ListUsersUseCase } from './application/use-cases/list-users/list-users.use-case';
import { MongooseUserRepository } from './infrastructure/persistence/mongoose-user.repository';
import {
  UserSchemaClass,
  UserSchema,
} from './infrastructure/persistence/user.schema';
import { UsersController } from './presentation/http/users.controller';
import { UsersHttpMapper } from './presentation/http/users.mapper';
import { USER_REPOSITORY } from './users.di-tokens';
import { SuperAdminSeeder } from '../../database/seed/superadmin.seed';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: UserSchemaClass.name, schema: UserSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [
    UsersHttpMapper,
    CreateUserUseCase,
    GetUserByIdUseCase,
    ListUsersUseCase,
    SuperAdminSeeder,
    {
      provide: USER_REPOSITORY,
      useClass: MongooseUserRepository,
    },
  ],
  exports: [USER_REPOSITORY, GetUserByIdUseCase, CreateUserUseCase],
})
export class UsersModule {}
