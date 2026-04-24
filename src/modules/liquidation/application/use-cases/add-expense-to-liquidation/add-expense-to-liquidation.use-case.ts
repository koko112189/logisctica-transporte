import { Inject, Injectable } from '@nestjs/common';
import { Expense } from '../../../domain/value-objects/expense.vo';
import { LiquidationNotFoundError } from '../../../domain/errors/liquidation.errors';
import type { TripLiquidationRepositoryPort } from '../../../domain/ports/trip-liquidation.repository.port';
import { TRIP_LIQUIDATION_REPOSITORY } from '../../../liquidation.di-tokens';
import { AddExpenseToLiquidationCommand } from './add-expense-to-liquidation.command';

@Injectable()
export class AddExpenseToLiquidationUseCase {
  constructor(
    @Inject(TRIP_LIQUIDATION_REPOSITORY)
    private readonly liquidations: TripLiquidationRepositoryPort,
  ) {}

  async execute(command: AddExpenseToLiquidationCommand): Promise<void> {
    const liq = await this.liquidations.findById(command.liquidationId, command.tenantId);
    if (!liq) throw new LiquidationNotFoundError(command.liquidationId);
    await this.liquidations.save(
      liq.addExpense(new Expense(command.type, command.description, command.amount, command.receiptUrl)),
    );
  }
}
