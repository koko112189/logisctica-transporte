import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AddExpenseToLiquidationUseCase } from './application/use-cases/add-expense-to-liquidation/add-expense-to-liquidation.use-case';
import { ApproveLiquidationUseCase } from './application/use-cases/approve-liquidation/approve-liquidation.use-case';
import { CompleteDeliveryUseCase } from './application/use-cases/complete-delivery/complete-delivery.use-case';
import { CreateCreditNoteUseCase } from './application/use-cases/create-credit-note/create-credit-note.use-case';
import { CreateStoreDeliveryUseCase } from './application/use-cases/create-store-delivery/create-store-delivery.use-case';
import { CreateTripLiquidationUseCase } from './application/use-cases/create-trip-liquidation/create-trip-liquidation.use-case';
import { GetLiquidationByTripUseCase } from './application/use-cases/get-liquidation-by-trip/get-liquidation-by-trip.use-case';
import { IssueCreditNoteUseCase } from './application/use-cases/issue-credit-note/issue-credit-note.use-case';
import { ListStoreDeliveriesUseCase } from './application/use-cases/list-store-deliveries/list-store-deliveries.use-case';
import { MarkPartialDeliveryUseCase } from './application/use-cases/mark-partial-delivery/mark-partial-delivery.use-case';
import { RejectLiquidationUseCase } from './application/use-cases/reject-liquidation/reject-liquidation.use-case';
import { SubmitLiquidationUseCase } from './application/use-cases/submit-liquidation/submit-liquidation.use-case';
import { MongooseCreditNoteRepository } from './infrastructure/persistence/mongoose-credit-note.repository';
import { MongooseStoreDeliveryRepository } from './infrastructure/persistence/mongoose-store-delivery.repository';
import { MongooseTripLiquidationRepository } from './infrastructure/persistence/mongoose-trip-liquidation.repository';
import {
  CreditNoteSchema,
  CreditNoteSchemaClass,
} from './infrastructure/persistence/credit-note.schema';
import {
  StoreDeliverySchema,
  StoreDeliverySchemaClass,
} from './infrastructure/persistence/store-delivery.schema';
import {
  TripLiquidationSchema,
  TripLiquidationSchemaClass,
} from './infrastructure/persistence/trip-liquidation.schema';
import { LiquidationController } from './presentation/http/liquidation.controller';
import {
  CREDIT_NOTE_REPOSITORY,
  STORE_DELIVERY_REPOSITORY,
  TRIP_LIQUIDATION_REPOSITORY,
} from './liquidation.di-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StoreDeliverySchemaClass.name, schema: StoreDeliverySchema },
      { name: CreditNoteSchemaClass.name, schema: CreditNoteSchema },
      { name: TripLiquidationSchemaClass.name, schema: TripLiquidationSchema },
    ]),
  ],
  controllers: [LiquidationController],
  providers: [
    CreateStoreDeliveryUseCase,
    ListStoreDeliveriesUseCase,
    CompleteDeliveryUseCase,
    MarkPartialDeliveryUseCase,
    CreateCreditNoteUseCase,
    IssueCreditNoteUseCase,
    CreateTripLiquidationUseCase,
    GetLiquidationByTripUseCase,
    AddExpenseToLiquidationUseCase,
    SubmitLiquidationUseCase,
    ApproveLiquidationUseCase,
    RejectLiquidationUseCase,
    { provide: STORE_DELIVERY_REPOSITORY, useClass: MongooseStoreDeliveryRepository },
    { provide: CREDIT_NOTE_REPOSITORY, useClass: MongooseCreditNoteRepository },
    { provide: TRIP_LIQUIDATION_REPOSITORY, useClass: MongooseTripLiquidationRepository },
  ],
})
export class LiquidationModule {}
