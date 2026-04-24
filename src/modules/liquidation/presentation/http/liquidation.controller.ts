import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Action } from '../../../../shared/domain/enums/action.enum';
import { TmsModule } from '../../../../shared/domain/enums/tms-module.enum';
import { CurrentUser } from '../../../../shared/presentation/decorators/current-user.decorator';
import { RequirePermissions } from '../../../../shared/presentation/decorators/require-permissions.decorator';
import { JwtAuthGuard } from '../../../../shared/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../../shared/presentation/guards/permissions.guard';
import { TenantGuard } from '../../../../shared/presentation/guards/tenant.guard';
import { SWAGGER_JWT_AUTH } from '../../../../shared/presentation/swagger/swagger.constants';
import type { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface';
import { AddExpenseToLiquidationCommand } from '../../application/use-cases/add-expense-to-liquidation/add-expense-to-liquidation.command';
import { AddExpenseToLiquidationUseCase } from '../../application/use-cases/add-expense-to-liquidation/add-expense-to-liquidation.use-case';
import { ApproveLiquidationCommand } from '../../application/use-cases/approve-liquidation/approve-liquidation.command';
import { ApproveLiquidationUseCase } from '../../application/use-cases/approve-liquidation/approve-liquidation.use-case';
import { CompleteDeliveryCommand } from '../../application/use-cases/complete-delivery/complete-delivery.command';
import { CompleteDeliveryUseCase } from '../../application/use-cases/complete-delivery/complete-delivery.use-case';
import { CreateCreditNoteCommand } from '../../application/use-cases/create-credit-note/create-credit-note.command';
import { CreateCreditNoteUseCase } from '../../application/use-cases/create-credit-note/create-credit-note.use-case';
import { CreateStoreDeliveryUseCase } from '../../application/use-cases/create-store-delivery/create-store-delivery.use-case';
import { CreateTripLiquidationCommand } from '../../application/use-cases/create-trip-liquidation/create-trip-liquidation.command';
import { CreateTripLiquidationUseCase } from '../../application/use-cases/create-trip-liquidation/create-trip-liquidation.use-case';
import { GetLiquidationByTripQuery } from '../../application/use-cases/get-liquidation-by-trip/get-liquidation-by-trip.query';
import { GetLiquidationByTripUseCase } from '../../application/use-cases/get-liquidation-by-trip/get-liquidation-by-trip.use-case';
import { IssueCreditNoteCommand } from '../../application/use-cases/issue-credit-note/issue-credit-note.command';
import { IssueCreditNoteUseCase } from '../../application/use-cases/issue-credit-note/issue-credit-note.use-case';
import { ListStoreDeliveriesQuery } from '../../application/use-cases/list-store-deliveries/list-store-deliveries.query';
import { ListStoreDeliveriesUseCase } from '../../application/use-cases/list-store-deliveries/list-store-deliveries.use-case';
import { MarkPartialDeliveryCommand } from '../../application/use-cases/mark-partial-delivery/mark-partial-delivery.command';
import { MarkPartialDeliveryUseCase } from '../../application/use-cases/mark-partial-delivery/mark-partial-delivery.use-case';
import { RejectLiquidationCommand } from '../../application/use-cases/reject-liquidation/reject-liquidation.command';
import { RejectLiquidationUseCase } from '../../application/use-cases/reject-liquidation/reject-liquidation.use-case';
import { SubmitLiquidationCommand } from '../../application/use-cases/submit-liquidation/submit-liquidation.command';
import { SubmitLiquidationUseCase } from '../../application/use-cases/submit-liquidation/submit-liquidation.use-case';
import { CreateStoreDeliveryCommand } from '../../application/use-cases/create-store-delivery/create-store-delivery.command';
import { SupplyItem } from '../../domain/value-objects/supply-item.vo';
import { CreditNoteItem } from '../../domain/value-objects/credit-note-item.vo';

class PaginationQuery {
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string)) page?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) @Transform(({ value }) => parseInt(value as string)) limit?: number;
}

@ApiTags('Liquidation')
@ApiBearerAuth(SWAGGER_JWT_AUTH)
@Controller('trips/:tripId')
@UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
export class LiquidationController {
  constructor(
    private readonly createDelivery: CreateStoreDeliveryUseCase,
    private readonly listDeliveries: ListStoreDeliveriesUseCase,
    private readonly completeDelivery: CompleteDeliveryUseCase,
    private readonly partialDelivery: MarkPartialDeliveryUseCase,
    private readonly createCreditNote: CreateCreditNoteUseCase,
    private readonly issueCreditNote: IssueCreditNoteUseCase,
    private readonly createLiquidation: CreateTripLiquidationUseCase,
    private readonly getLiquidation: GetLiquidationByTripUseCase,
    private readonly addExpense: AddExpenseToLiquidationUseCase,
    private readonly submitLiquidation: SubmitLiquidationUseCase,
    private readonly approveLiquidation: ApproveLiquidationUseCase,
    private readonly rejectLiquidation: RejectLiquidationUseCase,
  ) {}

  private requireTenantId(caller: JwtPayload): string {
    if (!caller.tenantId) throw new ForbiddenException('Operación requiere contexto de empresa');
    return caller.tenantId;
  }

  @Post('deliveries')
  @RequirePermissions({ module: TmsModule.CREDIT_NOTES, action: Action.WRITE })
  @ApiOperation({ summary: 'Crear entrega por tienda' })
  @ApiCreatedResponse({ schema: { properties: { deliveryId: { type: 'string' } } } })
  async createDeliveryEndpoint(
    @CurrentUser() caller: JwtPayload,
    @Param('tripId') tripId: string,
    @Body() body: { tripStopOrder: number; pickupPointId: string; supplies: { name: string; quantity: number; unit: string; unitValue: number; totalValue: number }[]; merchandiseValue: number; observations?: string },
  ): Promise<{ deliveryId: string }> {
    const tenantId = this.requireTenantId(caller);
    return this.createDelivery.execute(
      new CreateStoreDeliveryCommand(
        tenantId, tripId,
        body.tripStopOrder, body.pickupPointId,
        body.supplies.map((s) => new SupplyItem(s.name, s.quantity, s.unit, s.unitValue, s.totalValue)),
        body.merchandiseValue, body.observations ?? '',
      ),
    );
  }

  @Get('deliveries')
  @RequirePermissions({ module: TmsModule.CREDIT_NOTES, action: Action.READ })
  @ApiOperation({ summary: 'Listar entregas del viaje' })
  async listDeliveriesEndpoint(
    @CurrentUser() caller: JwtPayload,
    @Param('tripId') tripId: string,
  ) {
    const tenantId = this.requireTenantId(caller);
    return this.listDeliveries.execute(new ListStoreDeliveriesQuery(tripId, tenantId));
  }

  @Patch('deliveries/:deliveryId/complete')
  @RequirePermissions({ module: TmsModule.CREDIT_NOTES, action: Action.WRITE })
  @ApiOperation({ summary: 'Marcar entrega como completada' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async completeDeliveryEndpoint(
    @CurrentUser() caller: JwtPayload,
    @Param('deliveryId') deliveryId: string,
    @Body() body: { receivedByName: string },
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.completeDelivery.execute(new CompleteDeliveryCommand(deliveryId, tenantId, body.receivedByName));
  }

  @Patch('deliveries/:deliveryId/partial')
  @RequirePermissions({ module: TmsModule.CREDIT_NOTES, action: Action.WRITE })
  @ApiOperation({ summary: 'Marcar entrega como parcial' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async partialDeliveryEndpoint(
    @CurrentUser() caller: JwtPayload,
    @Param('deliveryId') deliveryId: string,
    @Body() body: { observations: string },
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.partialDelivery.execute(new MarkPartialDeliveryCommand(deliveryId, tenantId, body.observations));
  }

  @Post('deliveries/:deliveryId/credit-note')
  @RequirePermissions({ module: TmsModule.CREDIT_NOTES, action: Action.WRITE })
  @ApiOperation({ summary: 'Crear nota de crédito para entrega' })
  @ApiCreatedResponse({ schema: { properties: { creditNoteId: { type: 'string' } } } })
  async createCreditNoteEndpoint(
    @CurrentUser() caller: JwtPayload,
    @Param('tripId') tripId: string,
    @Param('deliveryId') deliveryId: string,
    @Body() body: { reason: string; items: { description: string; quantity: number; unitValue: number; totalValue: number }[] },
  ): Promise<{ creditNoteId: string }> {
    const tenantId = this.requireTenantId(caller);
    return this.createCreditNote.execute(
      new CreateCreditNoteCommand(
        tenantId, tripId, deliveryId, body.reason,
        body.items.map((i) => new CreditNoteItem(i.description, i.quantity, i.unitValue, i.totalValue)),
      ),
    );
  }

  @Patch('deliveries/:deliveryId/credit-note/issue')
  @RequirePermissions({ module: TmsModule.CREDIT_NOTES, action: Action.WRITE })
  @ApiOperation({ summary: 'Emitir nota de crédito' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async issueCreditNoteEndpoint(
    @CurrentUser() caller: JwtPayload,
    @Body() body: { creditNoteId: string },
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.issueCreditNote.execute(new IssueCreditNoteCommand(body.creditNoteId, tenantId));
  }

  @Post('liquidation')
  @RequirePermissions({ module: TmsModule.RATES, action: Action.WRITE })
  @ApiOperation({ summary: 'Crear liquidación del viaje' })
  @ApiCreatedResponse({ schema: { properties: { liquidationId: { type: 'string' } } } })
  async createLiquidationEndpoint(
    @CurrentUser() caller: JwtPayload,
    @Param('tripId') tripId: string,
    @Body() body: { totalMerchandiseValue: number; driverCommission: number },
  ): Promise<{ liquidationId: string }> {
    const tenantId = this.requireTenantId(caller);
    return this.createLiquidation.execute(
      new CreateTripLiquidationCommand(tenantId, tripId, body.totalMerchandiseValue, body.driverCommission),
    );
  }

  @Get('liquidation')
  @RequirePermissions({ module: TmsModule.RATES, action: Action.READ })
  @ApiOperation({ summary: 'Obtener liquidación del viaje' })
  async getLiquidationEndpoint(@CurrentUser() caller: JwtPayload, @Param('tripId') tripId: string) {
    const tenantId = this.requireTenantId(caller);
    return this.getLiquidation.execute(new GetLiquidationByTripQuery(tripId, tenantId));
  }

  @Patch('liquidation/expenses')
  @RequirePermissions({ module: TmsModule.RATES, action: Action.WRITE })
  @ApiOperation({ summary: 'Agregar gasto a liquidación' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async addExpenseEndpoint(
    @CurrentUser() caller: JwtPayload,
    @Body() body: { liquidationId: string; type: string; description: string; amount: number; receiptUrl?: string },
  ): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.addExpense.execute(
      new AddExpenseToLiquidationCommand(body.liquidationId, tenantId, body.type as import('../../domain/enums/expense-type.enum').ExpenseType, body.description, body.amount, body.receiptUrl ?? null),
    );
  }

  @Patch('liquidation/submit')
  @RequirePermissions({ module: TmsModule.RATES, action: Action.WRITE })
  @ApiOperation({ summary: 'Enviar liquidación para aprobación' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async submitEndpoint(@CurrentUser() caller: JwtPayload, @Body() body: { liquidationId: string }): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.submitLiquidation.execute(new SubmitLiquidationCommand(body.liquidationId, tenantId));
  }

  @Patch('liquidation/approve')
  @RequirePermissions({ module: TmsModule.RATES, action: Action.MANAGE })
  @ApiOperation({ summary: 'Aprobar liquidación' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async approveEndpoint(@CurrentUser() caller: JwtPayload, @Body() body: { liquidationId: string }): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.approveLiquidation.execute(new ApproveLiquidationCommand(body.liquidationId, tenantId, caller.sub));
  }

  @Patch('liquidation/reject')
  @RequirePermissions({ module: TmsModule.RATES, action: Action.MANAGE })
  @ApiOperation({ summary: 'Rechazar liquidación' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  async rejectEndpoint(@CurrentUser() caller: JwtPayload, @Body() body: { liquidationId: string }): Promise<void> {
    const tenantId = this.requireTenantId(caller);
    await this.rejectLiquidation.execute(new RejectLiquidationCommand(body.liquidationId, tenantId));
  }
}
