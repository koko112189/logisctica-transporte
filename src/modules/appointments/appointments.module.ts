import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '../users/users.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { CancelAppointmentUseCase } from './application/use-cases/cancel-appointment/cancel-appointment.use-case';
import { CompleteAppointmentUseCase } from './application/use-cases/complete-appointment/complete-appointment.use-case';
import { CreateAppointmentUseCase } from './application/use-cases/create-appointment/create-appointment.use-case';
import { GetAppointmentByIdUseCase } from './application/use-cases/get-appointment-by-id/get-appointment-by-id.use-case';
import { GetUpcomingForDriverUseCase } from './application/use-cases/get-upcoming-appointments-for-driver/get-upcoming-for-driver.use-case';
import { ListAppointmentsUseCase } from './application/use-cases/list-appointments/list-appointments.use-case';
import { StartAppointmentUseCase } from './application/use-cases/start-appointment/start-appointment.use-case';
import { UpdateAppointmentUseCase } from './application/use-cases/update-appointment/update-appointment.use-case';
import { MongooseAppointmentRepository } from './infrastructure/persistence/mongoose-appointment.repository';
import {
  AppointmentSchema,
  AppointmentSchemaClass,
} from './infrastructure/persistence/appointment.schema';
import { AppointmentsController } from './presentation/http/appointments.controller';
import { AppointmentsHttpMapper } from './presentation/http/appointments.mapper';
import { APPOINTMENT_REPOSITORY } from './appointments.di-tokens';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AppointmentSchemaClass.name, schema: AppointmentSchema },
    ]),
    UsersModule,
    VehiclesModule,
  ],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsHttpMapper,
    CreateAppointmentUseCase,
    UpdateAppointmentUseCase,
    CancelAppointmentUseCase,
    StartAppointmentUseCase,
    CompleteAppointmentUseCase,
    GetAppointmentByIdUseCase,
    ListAppointmentsUseCase,
    GetUpcomingForDriverUseCase,
    { provide: APPOINTMENT_REPOSITORY, useClass: MongooseAppointmentRepository },
  ],
  exports: [GetAppointmentByIdUseCase],
})
export class AppointmentsModule {}
