import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChecklistModule } from '../checklist/checklist.module';
import { RoutePointsModule } from '../route-points/route-points.module';
import { ArriveAtStopUseCase } from './application/use-cases/arrive-at-stop/arrive-at-stop.use-case';
import { CancelTripUseCase } from './application/use-cases/cancel-trip/cancel-trip.use-case';
import { CompleteTripUseCase } from './application/use-cases/complete-trip/complete-trip.use-case';
import { CompleteStopUseCase } from './application/use-cases/complete-stop/complete-stop.use-case';
import { CreateTripUseCase } from './application/use-cases/create-trip/create-trip.use-case';
import { GetActiveTripForDriverUseCase } from './application/use-cases/get-active-trip-for-driver/get-active-trip-for-driver.use-case';
import { GetTripByIdUseCase } from './application/use-cases/get-trip-by-id/get-trip-by-id.use-case';
import { GetTripRouteUseCase } from './application/use-cases/get-trip-route/get-trip-route.use-case';
import { ListTripsUseCase } from './application/use-cases/list-trips/list-trips.use-case';
import { ReportDelayUseCase } from './application/use-cases/report-delay/report-delay.use-case';
import { StartTripUseCase } from './application/use-cases/start-trip/start-trip.use-case';
import { UpdateTripLocationUseCase } from './application/use-cases/update-trip-location/update-trip-location.use-case';
import { MongooseTripRepository } from './infrastructure/persistence/mongoose-trip.repository';
import { TripSchema, TripSchemaClass } from './infrastructure/persistence/trip.schema';
import { TripsController } from './presentation/http/trips.controller';
import { TripsHttpMapper } from './presentation/http/trips.mapper';
import { TRIP_REPOSITORY } from './trips.di-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TripSchemaClass.name, schema: TripSchema }]),
    ChecklistModule,
    RoutePointsModule,
  ],
  controllers: [TripsController],
  providers: [
    TripsHttpMapper,
    CreateTripUseCase,
    StartTripUseCase,
    UpdateTripLocationUseCase,
    ArriveAtStopUseCase,
    CompleteStopUseCase,
    ReportDelayUseCase,
    CompleteTripUseCase,
    CancelTripUseCase,
    GetTripByIdUseCase,
    ListTripsUseCase,
    GetActiveTripForDriverUseCase,
    GetTripRouteUseCase,
    { provide: TRIP_REPOSITORY, useClass: MongooseTripRepository },
  ],
  exports: [GetTripByIdUseCase, TRIP_REPOSITORY],
})
export class TripsModule {}
