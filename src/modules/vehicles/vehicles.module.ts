import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { AddDefectUseCase } from './application/use-cases/add-defect/add-defect.use-case';
import { AddRepairUseCase } from './application/use-cases/add-repair/add-repair.use-case';
import { CreateVehicleUseCase } from './application/use-cases/create-vehicle/create-vehicle.use-case';
import { DeactivateVehicleUseCase } from './application/use-cases/deactivate-vehicle/deactivate-vehicle.use-case';
import { GetVehicleByIdUseCase } from './application/use-cases/get-vehicle-by-id/get-vehicle-by-id.use-case';
import { ListVehiclesUseCase } from './application/use-cases/list-vehicles/list-vehicles.use-case';
import { ResolveDefectUseCase } from './application/use-cases/resolve-defect/resolve-defect.use-case';
import { UpdateVehicleUseCase } from './application/use-cases/update-vehicle/update-vehicle.use-case';
import { MongooseVehicleRepository } from './infrastructure/persistence/mongoose-vehicle.repository';
import {
  VehicleSchema,
  VehicleSchemaClass,
} from './infrastructure/persistence/vehicle.schema';
import { VehiclesController } from './presentation/http/vehicles.controller';
import { VehiclesHttpMapper } from './presentation/http/vehicles.mapper';
import { VEHICLE_REPOSITORY } from './vehicles.di-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: VehicleSchemaClass.name, schema: VehicleSchema },
    ]),
    UsersModule,
  ],
  controllers: [VehiclesController],
  providers: [
    VehiclesHttpMapper,
    CreateVehicleUseCase,
    UpdateVehicleUseCase,
    DeactivateVehicleUseCase,
    GetVehicleByIdUseCase,
    ListVehiclesUseCase,
    AddDefectUseCase,
    ResolveDefectUseCase,
    AddRepairUseCase,
    { provide: VEHICLE_REPOSITORY, useClass: MongooseVehicleRepository },
  ],
  exports: [GetVehicleByIdUseCase, VEHICLE_REPOSITORY],
})
export class VehiclesModule {}
