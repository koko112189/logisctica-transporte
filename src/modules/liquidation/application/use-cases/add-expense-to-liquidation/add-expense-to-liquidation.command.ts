import type { ExpenseType } from '../../../domain/enums/expense-type.enum';

export class AddExpenseToLiquidationCommand {
  constructor(
    public readonly liquidationId: string,
    public readonly tenantId: string,
    public readonly type: ExpenseType,
    public readonly description: string,
    public readonly amount: number,
    public readonly receiptUrl: string | null,
  ) {}
}
