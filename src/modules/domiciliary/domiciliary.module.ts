import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateDomiciliaryProfileUseCase } from './application/use-cases/create-domiciliary-profile/create-domiciliary-profile.use-case';
import { GetDomiciliaryProfileUseCase } from './application/use-cases/get-domiciliary-profile/get-domiciliary-profile.use-case';
import { ListDomiciliaryProfilesUseCase } from './application/use-cases/list-domiciliary-profiles/list-domiciliary-profiles.use-case';
import { UpdateDomiciliaryProfileUseCase } from './application/use-cases/update-domiciliary-profile/update-domiciliary-profile.use-case';
import { DomiciliaryProfileSchema, DomiciliaryProfileSchemaClass } from './infrastructure/persistence/domiciliary-profile.schema';
import { MongooseDomiciliaryProfileRepository } from './infrastructure/persistence/mongoose-domiciliary-profile.repository';
import { DomiciliaryController } from './presentation/http/domiciliary.controller';
import { DOMICILIARY_PROFILE_REPOSITORY } from './domiciliary.di-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DomiciliaryProfileSchemaClass.name, schema: DomiciliaryProfileSchema }]),
  ],
  controllers: [DomiciliaryController],
  providers: [
    { provide: DOMICILIARY_PROFILE_REPOSITORY, useClass: MongooseDomiciliaryProfileRepository },
    CreateDomiciliaryProfileUseCase,
    GetDomiciliaryProfileUseCase,
    ListDomiciliaryProfilesUseCase,
    UpdateDomiciliaryProfileUseCase,
  ],
})
export class DomiciliaryModule {}
