import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CoordinatesVO } from '../../../../../shared/domain/value-objects/coordinates.vo';
import { PickupPoint } from '../../../domain/entities/pickup-point.entity';
import type { PickupPointRepositoryPort } from '../../../domain/ports/pickup-point.repository.port';
import { PICKUP_POINT_REPOSITORY } from '../../../route-points.di-tokens';
import { CreatePickupPointCommand } from './create-pickup-point.command';

@Injectable()
export class CreatePickupPointUseCase {
  constructor(
    @Inject(PICKUP_POINT_REPOSITORY)
    private readonly points: PickupPointRepositoryPort,
  ) {}

  async execute(command: CreatePickupPointCommand): Promise<{ pickupPointId: string }> {
    const now = new Date();
    const point = new PickupPoint(
      randomUUID(),
      command.tenantId,
      command.name,
      command.type,
      command.address,
      command.city,
      command.postalCode,
      command.lat != null && command.lng != null
        ? new CoordinatesVO(command.lat, command.lng)
        : null,
      command.contactName,
      command.contactPhone,
      command.contactEmail,
      command.operatingHours,
      true,
      now,
      now,
    );
    await this.points.save(point);
    return { pickupPointId: point.id };
  }
}
