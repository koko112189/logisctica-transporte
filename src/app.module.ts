import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditModule } from './modules/audit/audit.module';
import { AuthModule } from './modules/auth/auth.module';
import { CarriersModule } from './modules/carriers/carriers.module';
import { DomiciliaryModule } from './modules/domiciliary/domiciliary.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
import { NotificationsModule } from './shared/notifications.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { RoutePointsModule } from './modules/route-points/route-points.module';
import { TripsModule } from './modules/trips/trips.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { LiquidationModule } from './modules/liquidation/liquidation.module';
import { WarehousesModule } from './modules/warehouses/warehouses.module';

@Module({
  imports: [
    EventEmitterModule.forRoot({ wildcard: false, delimiter: '.' }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.getOrThrow<string>('MONGO_URI'),
      }),
    }),
    NotificationsModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    VehiclesModule,
    ChecklistModule,
    AppointmentsModule,
    RoutePointsModule,
    TripsModule,
    DriversModule,
    LiquidationModule,
    CarriersModule,
    DomiciliaryModule,
    WarehousesModule,
    AuditModule,
  ],
})
export class AppModule {}
