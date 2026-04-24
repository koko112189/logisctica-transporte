import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { TripLiquidation } from '../../../domain/entities/trip-liquidation.entity';
import { LiquidationStatus } from '../../../domain/enums/liquidation-status.enum';
import { LiquidationAlreadyExistsError } from '../../../domain/errors/liquidation.errors';
import type { TripLiquidationRepositoryPort } from '../../../domain/ports/trip-liquidation.repository.port';
import { TRIP_LIQUIDATION_REPOSITORY } from '../../../liquidation.di-tokens';
import { CreateTripLiquidationCommand } from './create-trip-liquidation.command';

@Injectable()
export class CreateTripLiquidationUseCase {
  constructor(
    @Inject(TRIP_LIQUIDATION_REPOSITORY)
    private readonly liquidations: TripLiquidationRepositoryPort,
  ) {}

  async execute(command: CreateTripLiquidationCommand): Promise<{ liquidationId: string }> {
    const existing = await this.liquidations.findByTrip(command.tripId, command.tenantId);
    if (existing) throw new LiquidationAlreadyExistsError(command.tripId);

    const now = new Date();
    const liquidation = new TripLiquidation(
      randomUUID(),
      command.tenantId,
      command.tripId,
      command.totalMerchandiseValue,
      [],
      command.driverCommission,
      [],
      LiquidationStatus.DRAFT,
      null,
      null,
      now,
      now,
    );
    await this.liquidations.save(liquidation);
    return { liquidationId: liquidation.id };
  }
}
