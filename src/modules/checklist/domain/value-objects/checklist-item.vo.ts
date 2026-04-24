import type { ChecklistCategory } from '../enums/checklist-category.enum';
import type { ItemStatus } from '../enums/item-status.enum';

export class ChecklistItem {
  constructor(
    public readonly category: ChecklistCategory,
    public readonly name: string,
    public readonly status: ItemStatus,
    public readonly observation: string | null,
  ) {}
}
