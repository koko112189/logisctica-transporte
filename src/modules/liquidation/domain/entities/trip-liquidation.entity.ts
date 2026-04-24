import { LiquidationStatus } from '../enums/liquidation-status.enum';
import type { Commission } from '../value-objects/commission.vo';
import type { Expense } from '../value-objects/expense.vo';

export class TripLiquidation {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly tripId: string,
    public readonly totalMerchandiseValue: number,
    public readonly travelExpenses: Expense[],
    public readonly driverCommission: number,
    public readonly otherCommissions: Commission[],
    public readonly status: LiquidationStatus,
    public readonly approvedByUserId: string | null,
    public readonly approvedAt: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  get totalExpenses(): number {
    return this.travelExpenses.reduce((sum, e) => sum + e.amount, 0);
  }

  get totalCommissions(): number {
    return this.driverCommission + this.otherCommissions.reduce((sum, c) => sum + c.amount, 0);
  }

  get netValue(): number {
    return this.totalMerchandiseValue - this.totalExpenses - this.totalCommissions;
  }

  addExpense(expense: Expense): TripLiquidation {
    return new TripLiquidation(
      this.id, this.tenantId, this.tripId, this.totalMerchandiseValue,
      [...this.travelExpenses, expense],
      this.driverCommission, this.otherCommissions,
      this.status, this.approvedByUserId, this.approvedAt,
      this.createdAt, new Date(),
    );
  }

  submit(): TripLiquidation {
    return new TripLiquidation(
      this.id, this.tenantId, this.tripId, this.totalMerchandiseValue,
      this.travelExpenses, this.driverCommission, this.otherCommissions,
      LiquidationStatus.SUBMITTED, this.approvedByUserId, this.approvedAt,
      this.createdAt, new Date(),
    );
  }

  approve(userId: string, now: Date): TripLiquidation {
    return new TripLiquidation(
      this.id, this.tenantId, this.tripId, this.totalMerchandiseValue,
      this.travelExpenses, this.driverCommission, this.otherCommissions,
      LiquidationStatus.APPROVED, userId, now, this.createdAt, now,
    );
  }

  reject(): TripLiquidation {
    return new TripLiquidation(
      this.id, this.tenantId, this.tripId, this.totalMerchandiseValue,
      this.travelExpenses, this.driverCommission, this.otherCommissions,
      LiquidationStatus.REJECTED, this.approvedByUserId, this.approvedAt,
      this.createdAt, new Date(),
    );
  }
}
