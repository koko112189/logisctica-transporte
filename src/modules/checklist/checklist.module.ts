import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { CreateDailyChecklistUseCase } from './application/use-cases/create-daily-checklist/create-daily-checklist.use-case';
import { GetChecklistByIdUseCase } from './application/use-cases/get-checklist-by-id/get-checklist-by-id.use-case';
import { GetChecklistByVehicleAndDateUseCase } from './application/use-cases/get-checklist-by-vehicle-and-date/get-checklist-by-vehicle-and-date.use-case';
import { GetPendingChecklistsForDriverUseCase } from './application/use-cases/get-pending-checklists-for-driver/get-pending-checklists-for-driver.use-case';
import { ListChecklistsUseCase } from './application/use-cases/list-checklists/list-checklists.use-case';
import { SubmitChecklistUseCase } from './application/use-cases/submit-checklist/submit-checklist.use-case';
import { MongooseChecklistRepository } from './infrastructure/persistence/mongoose-checklist.repository';
import {
  ChecklistSchema,
  ChecklistSchemaClass,
} from './infrastructure/persistence/checklist.schema';
import { ChecklistsController } from './presentation/http/checklists.controller';
import { ChecklistsHttpMapper } from './presentation/http/checklists.mapper';
import { CHECKLIST_REPOSITORY } from './checklist.di-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChecklistSchemaClass.name, schema: ChecklistSchema },
    ]),
    VehiclesModule,
  ],
  controllers: [ChecklistsController],
  providers: [
    ChecklistsHttpMapper,
    CreateDailyChecklistUseCase,
    SubmitChecklistUseCase,
    GetChecklistByIdUseCase,
    GetChecklistByVehicleAndDateUseCase,
    ListChecklistsUseCase,
    GetPendingChecklistsForDriverUseCase,
    { provide: CHECKLIST_REPOSITORY, useClass: MongooseChecklistRepository },
  ],
  exports: [GetChecklistByVehicleAndDateUseCase, CHECKLIST_REPOSITORY],
})
export class ChecklistModule {}
