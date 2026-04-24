import { Inject, Injectable } from '@nestjs/common';
import { CoordinatesVO } from '../../../../../shared/domain/value-objects/coordinates.vo';
import { PickupPointNotFoundError } from '../../../domain/errors/pickup-point.errors';
import type { PickupPointRepositoryPort } from '../../../domain/ports/pickup-point.repository.port';
import { PICKUP_POINT_REPOSITORY } from '../../../route-points.di-tokens';
import { UpdatePickupPointCommand } from './update-pickup-point.command';

@Injectable()
export class UpdatePickupPointUseCase {
  constructor(
    @Inject(PICKUP_POINT_REPOSITORY)
    private readonly points: PickupPointRepositoryPort,
  ) {}

  async execute(command: UpdatePickupPointCommand): Promise<void> {
    const point = await this.points.findById(command.pickupPointId, command.tenantId);
    if (!point) throw new PickupPointNotFoundError(command.pickupPointId);

    let coordinates = point.coordinates;
    if (command.lat !== undefined && command.lng !== undefined) {
      coordinates =
        command.lat != null && command.lng != null
          ? new CoordinatesVO(command.lat, command.lng)
          : null;
    }

    await this.points.save(
      point.withUpdatedFields({
        name: command.name,
        type: command.type,
        address: command.address,
        city: command.city,
        postalCode: command.postalCode,
        coordinates,
        contactName: command.contactName,
        contactPhone: command.contactPhone,
        contactEmail: command.contactEmail,
        operatingHours: command.operatingHours,
      }),
    );
  }
}
