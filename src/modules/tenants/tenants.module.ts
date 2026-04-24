import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateTenantUseCase } from './application/use-cases/create-tenant/create-tenant.use-case';
import { GetTenantByIdUseCase } from './application/use-cases/get-tenant-by-id/get-tenant-by-id.use-case';
import { ListTenantsUseCase } from './application/use-cases/list-tenants/list-tenants.use-case';
import { MongooseTenantRepository } from './infrastructure/persistence/mongoose-tenant.repository';
import {
  TenantSchemaClass,
  TenantSchema,
} from './infrastructure/persistence/tenant.schema';
import { TenantsController } from './presentation/http/tenants.controller';
import { TenantsHttpMapper } from './presentation/http/tenants.mapper';
import { TENANT_REPOSITORY } from './tenants.di-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TenantSchemaClass.name, schema: TenantSchema },
    ]),
  ],
  controllers: [TenantsController],
  providers: [
    TenantsHttpMapper,
    CreateTenantUseCase,
    GetTenantByIdUseCase,
    ListTenantsUseCase,
    {
      provide: TENANT_REPOSITORY,
      useClass: MongooseTenantRepository,
    },
  ],
  exports: [TENANT_REPOSITORY, GetTenantByIdUseCase],
})
export class TenantsModule {}
