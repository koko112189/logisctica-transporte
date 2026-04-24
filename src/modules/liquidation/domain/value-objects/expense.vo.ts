import type { ExpenseType } from '../enums/expense-type.enum';

export class Expense {
  constructor(
    public readonly type: ExpenseType,
    public readonly description: string,
    public readonly amount: number,
    public readonly receiptUrl: string | null,
  ) {}
}
