import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CreatePickupPointUseCase } from './application/use-cases/create-pickup-point/create-pickup-point.use-case';
import { DeactivatePickupPointUseCase } from './application/use-cases/deactivate-pickup-point/deactivate-pickup-point.use-case';
import { GetPickupPointByIdUseCase } from './application/use-cases/get-pickup-point-by-id/get-pickup-point-by-id.use-case';
import { ListPickupPointsUseCase } from './application/use-cases/list-pickup-points/list-pickup-points.use-case';
import { UpdatePickupPointUseCase } from './application/use-cases/update-pickup-point/update-pickup-point.use-case';
import { MongoosePickupPointRepository } from './infrastructure/persistence/mongoose-pickup-point.repository';
import {
  PickupPointSchema,
  PickupPointSchemaClass,
} from './infrastructure/persistence/pickup-point.schema';
import { RoutePointsController } from './presentation/http/route-points.controller';
import { RoutePointsHttpMapper } from './presentation/http/route-points.mapper';
import { PICKUP_POINT_REPOSITORY } from './route-points.di-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PickupPointSchemaClass.name, schema: PickupPointSchema },
    ]),
  ],
  controllers: [RoutePointsController],
  providers: [
    RoutePointsHttpMapper,
    CreatePickupPointUseCase,
    UpdatePickupPointUseCase,
    DeactivatePickupPointUseCase,
    GetPickupPointByIdUseCase,
    ListPickupPointsUseCase,
    { provide: PICKUP_POINT_REPOSITORY, useClass: MongoosePickupPointRepository },
  ],
  exports: [GetPickupPointByIdUseCase],
})
export class RoutePointsModule {}
