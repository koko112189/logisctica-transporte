import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignVehicleToDriverUseCase } from './application/use-cases/assign-vehicle-to-driver/assign-vehicle-to-driver.use-case';
import { CreateDriverProfileUseCase } from './application/use-cases/create-driver-profile/create-driver-profile.use-case';
import { CreateDriverSurveyUseCase } from './application/use-cases/create-driver-survey/create-driver-survey.use-case';
import { GetDriverProfileUseCase } from './application/use-cases/get-driver-profile/get-driver-profile.use-case';
import { GetDriverSurveyByIdUseCase } from './application/use-cases/get-driver-survey-by-id/get-driver-survey-by-id.use-case';
import { GetPendingSurveysForDriverUseCase } from './application/use-cases/get-pending-surveys-for-driver/get-pending-surveys-for-driver.use-case';
import { ListDriverProfilesUseCase } from './application/use-cases/list-driver-profiles/list-driver-profiles.use-case';
import { ListDriverSurveysUseCase } from './application/use-cases/list-driver-surveys/list-driver-surveys.use-case';
import { SubmitDriverSurveyUseCase } from './application/use-cases/submit-driver-survey/submit-driver-survey.use-case';
import { UpdateDriverProfileUseCase } from './application/use-cases/update-driver-profile/update-driver-profile.use-case';
import { MongooseDriverProfileRepository } from './infrastructure/persistence/mongoose-driver-profile.repository';
import { MongooseDriverSurveyRepository } from './infrastructure/persistence/mongoose-driver-survey.repository';
import {
  DriverProfileSchema,
  DriverProfileSchemaClass,
} from './infrastructure/persistence/driver-profile.schema';
import {
  DriverSurveySchema,
  DriverSurveySchemaClass,
} from './infrastructure/persistence/driver-survey.schema';
import { DriversController } from './presentation/http/drivers.controller';
import { DRIVER_PROFILE_REPOSITORY, DRIVER_SURVEY_REPOSITORY } from './drivers.di-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DriverProfileSchemaClass.name, schema: DriverProfileSchema },
      { name: DriverSurveySchemaClass.name, schema: DriverSurveySchema },
    ]),
  ],
  controllers: [DriversController],
  providers: [
    CreateDriverProfileUseCase,
    UpdateDriverProfileUseCase,
    AssignVehicleToDriverUseCase,
    GetDriverProfileUseCase,
    ListDriverProfilesUseCase,
    CreateDriverSurveyUseCase,
    SubmitDriverSurveyUseCase,
    GetDriverSurveyByIdUseCase,
    ListDriverSurveysUseCase,
    GetPendingSurveysForDriverUseCase,
    { provide: DRIVER_PROFILE_REPOSITORY, useClass: MongooseDriverProfileRepository },
    { provide: DRIVER_SURVEY_REPOSITORY, useClass: MongooseDriverSurveyRepository },
  ],
  exports: [GetDriverProfileUseCase],
})
export class DriversModule {}
