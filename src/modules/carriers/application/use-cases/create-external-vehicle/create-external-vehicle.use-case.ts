import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { randomUUID } from 'node:crypto';
import { CalypsoEvents } from '../../../../../shared/events/calypso-events';
import { ExternalVehicle } from '../../../domain/entities/external-vehicle.entity';
import { ExternalCarrierNotFoundError, ExternalVehiclePlateExistsError } from '../../../domain/errors/carrier.errors';
import type { ExternalCarrierRepositoryPort } from '../../../domain/ports/external-carrier.repository.port';
import type { ExternalVehicleRepositoryPort } from '../../../domain/ports/external-vehicle.repository.port';
import { EXTERNAL_CARRIER_REPOSITORY, EXTERNAL_VEHICLE_REPOSITORY } from '../../../carriers.di-tokens';
import { CreateExternalVehicleCommand } from './create-external-vehicle.command';

@Injectable()
export class CreateExternalVehicleUseCase {
  constructor(
    @Inject(EXTERNAL_CARRIER_REPOSITORY)
    private readonly carriers: ExternalCarrierRepositoryPort,
    @Inject(EXTERNAL_VEHICLE_REPOSITORY)
    private readonly vehicles: ExternalVehicleRepositoryPort,
    private readonly events: EventEmitter2,
  ) {}

  async execute(cmd: CreateExternalVehicleCommand): Promise<{ vehicleId: string }> {
    const carrier = await this.carriers.findById(cmd.carrierId, cmd.tenantId);
    if (!carrier) throw new ExternalCarrierNotFoundError();
    const plate = cmd.licensePlate.toUpperCase().trim();
    if (await this.vehicles.findByPlate(plate, cmd.tenantId)) {
      throw new ExternalVehiclePlateExistsError(plate);
    }
    const now = new Date();
    const id = randomUUID();
    const v = new ExternalVehicle(
      id,
      cmd.tenantId,
      cmd.carrierId,
      plate,
      cmd.kind,
      cmd.label.trim(),
      cmd.capacityKg,
      true,
      cmd.notes.trim(),
      now,
      now,
    );
    await this.vehicles.save(v);
    this.events.emit(CalypsoEvents.EXTERNAL_VEHICLE_CREATED, {
      tenantId: cmd.tenantId,
      performedByUserId: null,
      vehicleId: id,
      carrierId: cmd.carrierId,
      licensePlate: plate,
    });
    return { vehicleId: id };
  }
}
