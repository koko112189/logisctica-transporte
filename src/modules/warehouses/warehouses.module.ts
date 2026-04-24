import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateWarehouseUseCase } from './application/use-cases/create-warehouse/create-warehouse.use-case';
import { GetWarehouseUseCase } from './application/use-cases/get-warehouse/get-warehouse.use-case';
import { ListWarehousesUseCase } from './application/use-cases/list-warehouses/list-warehouses.use-case';
import { TestWarehouseNotificationUseCase } from './application/use-cases/test-warehouse-notification/test-warehouse-notification.use-case';
import { UpdateWarehouseUseCase } from './application/use-cases/update-warehouse/update-warehouse.use-case';
import { MongooseWarehouseRepository } from './infrastructure/persistence/mongoose-warehouse.repository';
import { WarehouseSchema, WarehouseSchemaClass } from './infrastructure/persistence/warehouse.schema';
import { WarehousesController } from './presentation/http/warehouses.controller';
import { WarehouseTripDispatchListener } from './presentation/warehouse-trip-dispatch.listener';
import { WAREHOUSE_REPOSITORY } from './warehouses.di-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: WarehouseSchemaClass.name, schema: WarehouseSchema }]),
  ],
  controllers: [WarehousesController],
  providers: [
    { provide: WAREHOUSE_REPOSITORY, useClass: MongooseWarehouseRepository },
    CreateWarehouseUseCase,
    ListWarehousesUseCase,
    GetWarehouseUseCase,
    UpdateWarehouseUseCase,
    TestWarehouseNotificationUseCase,
    WarehouseTripDispatchListener,
  ],
  exports: [WAREHOUSE_REPOSITORY],
})
export class WarehousesModule {}
