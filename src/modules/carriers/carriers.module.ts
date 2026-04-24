import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateExternalCarrierUseCase } from './application/use-cases/create-external-carrier/create-external-carrier.use-case';
import { CreateExternalVehicleUseCase } from './application/use-cases/create-external-vehicle/create-external-vehicle.use-case';
import { GetExternalCarrierUseCase } from './application/use-cases/get-external-carrier/get-external-carrier.use-case';
import { ListExternalCarriersUseCase } from './application/use-cases/list-external-carriers/list-external-carriers.use-case';
import { ListExternalVehiclesUseCase } from './application/use-cases/list-external-vehicles/list-external-vehicles.use-case';
import { UpdateExternalCarrierUseCase } from './application/use-cases/update-external-carrier/update-external-carrier.use-case';
import {
  ExternalCarrierSchema,
  ExternalCarrierSchemaClass,
} from './infrastructure/persistence/external-carrier.schema';
import {
  ExternalVehicleSchema,
  ExternalVehicleSchemaClass,
} from './infrastructure/persistence/external-vehicle.schema';
import { MongooseExternalCarrierRepository } from './infrastructure/persistence/mongoose-external-carrier.repository';
import { MongooseExternalVehicleRepository } from './infrastructure/persistence/mongoose-external-vehicle.repository';
import { CarriersController } from './presentation/http/carriers.controller';
import { EXTERNAL_CARRIER_REPOSITORY, EXTERNAL_VEHICLE_REPOSITORY } from './carriers.di-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ExternalCarrierSchemaClass.name, schema: ExternalCarrierSchema },
      { name: ExternalVehicleSchemaClass.name, schema: ExternalVehicleSchema },
    ]),
  ],
  controllers: [CarriersController],
  providers: [
    { provide: EXTERNAL_CARRIER_REPOSITORY, useClass: MongooseExternalCarrierRepository },
    { provide: EXTERNAL_VEHICLE_REPOSITORY, useClass: MongooseExternalVehicleRepository },
    CreateExternalCarrierUseCase,
    ListExternalCarriersUseCase,
    GetExternalCarrierUseCase,
    UpdateExternalCarrierUseCase,
    CreateExternalVehicleUseCase,
    ListExternalVehiclesUseCase,
  ],
  exports: [EXTERNAL_CARRIER_REPOSITORY, EXTERNAL_VEHICLE_REPOSITORY],
})
export class CarriersModule {}
