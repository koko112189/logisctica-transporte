import { Inject, Injectable } from '@nestjs/common';
import { LiquidationNotFoundError } from '../../../domain/errors/liquidation.errors';
import type { TripLiquidationRepositoryPort } from '../../../domain/ports/trip-liquidation.repository.port';
import { TRIP_LIQUIDATION_REPOSITORY } from '../../../liquidation.di-tokens';
import { ApproveLiquidationCommand } from './approve-liquidation.command';

@Injectable()
export class ApproveLiquidationUseCase {
  constructor(
    @Inject(TRIP_LIQUIDATION_REPOSITORY)
    private readonly liquidations: TripLiquidationRepositoryPort,
  ) {}

  async execute(command: ApproveLiquidationCommand): Promise<void> {
    const liq = await this.liquidations.findById(command.liquidationId, command.tenantId);
    if (!liq) throw new LiquidationNotFoundError(command.liquidationId);
    await this.liquidations.save(liq.approve(command.approvedByUserId, new Date()));
  }
}
