import { Inject, Injectable } from '@nestjs/common';
import { randomBytes, randomUUID } from 'node:crypto';
import { Action } from '../../../../../shared/domain/enums/action.enum';
import { TmsModule } from '../../../../../shared/domain/enums/tms-module.enum';
import { UserRole } from '../../../../../shared/domain/enums/user-role.enum';
import { Permission } from '../../../../../shared/domain/value-objects/permission.vo';
import { CreateUserCommand } from '../../../../users/application/use-cases/create-user/create-user.command';
import { CreateUserUseCase } from '../../../../users/application/use-cases/create-user/create-user.use-case';
import { Vehicle } from '../../../domain/entities/vehicle.entity';
import { VehicleStatus } from '../../../domain/enums/vehicle-status.enum';
import { VehiclePlateAlreadyExistsError } from '../../../domain/errors/vehicle.errors';
import type { VehicleRepositoryPort } from '../../../domain/ports/vehicle.repository.port';
import { VEHICLE_REPOSITORY } from '../../../vehicles.di-tokens';
import { CreateVehicleCommand } from './create-vehicle.command';
import { CreateVehicleResult } from './create-vehicle.result';

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    @Inject(VEHICLE_REPOSITORY)
    private readonly vehicles: VehicleRepositoryPort,
    private readonly createUser: CreateUserUseCase,
  ) {}

  async execute(command: CreateVehicleCommand): Promise<CreateVehicleResult> {
    const plate = command.licensePlate.toUpperCase().trim();
    const existing = await this.vehicles.findByLicensePlate(
      plate,
      command.tenantId,
    );
    if (existing) throw new VehiclePlateAlreadyExistsError(plate);

    const safePlate = plate.toLowerCase().replace(/[^a-z0-9]/g, '');
    const driverEmail = `conductor.${safePlate}@${command.tenantId.slice(0, 8)}.tms`;
    const tempPassword = randomBytes(5).toString('hex');

    const driverResult = await this.createUser.execute(
      new CreateUserCommand(
        command.tenantId,
        driverEmail,
        `Conductor ${plate}`,
        tempPassword,
        [
          new Permission(TmsModule.VEHICLES, [Action.READ]),
          new Permission(TmsModule.CHECKLIST, [Action.WRITE]),
          new Permission(TmsModule.DRIVERS, [Action.WRITE]),
        ],
        UserRole.DRIVER,
      ),
    );

    const vehicleId = randomUUID();
    const now = new Date();
    const vehicle = new Vehicle(
      vehicleId,
      command.tenantId,
      plate,
      command.vehicleType,
      command.brand.trim(),
      command.model.trim(),
      command.year,
      command.capacity,
      [],
      [],
      command.observations.trim(),
      driverResult.id,
      VehicleStatus.ACTIVE,
      now,
      now,
    );
    await this.vehicles.save(vehicle);

    return new CreateVehicleResult(
      vehicleId,
      driverResult.id,
      driverEmail,
      tempPassword,
    );
  }
}
