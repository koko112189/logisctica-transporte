import { Action } from '../enums/action.enum';
import { TmsModule } from '../enums/tms-module.enum';

export class Permission {
  constructor(
    public readonly module: TmsModule,
    public readonly actions: Action[],
  ) {}

  allows(action: Action): boolean {
    return (
      this.actions.includes(action) || this.actions.includes(Action.MANAGE)
    );
  }

  static fromPlain(plain: {
    module: TmsModule;
    actions: Action[];
  }): Permission {
    return new Permission(plain.module, plain.actions);
  }
}
