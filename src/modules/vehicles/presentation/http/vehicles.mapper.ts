import { Injectable } from '@nestjs/common';
import type { Vehicle } from '../../domain/entities/vehicle.entity';
import { CreateVehicleCommand } from '../../application/use-cases/create-vehicle/create-vehicle.command';
import { UpdateVehicleCommand } from '../../application/use-cases/update-vehicle/update-vehicle.command';
import { AddDefectCommand } from '../../application/use-cases/add-defect/add-defect.command';
import { AddRepairCommand } from '../../application/use-cases/add-repair/add-repair.command';
import type { CreateVehicleRequestDto } from './dto/create-vehicle.request.dto';
import type { UpdateVehicleRequestDto } from './dto/update-vehicle.request.dto';
import type { AddDefectRequestDto } from './dto/add-defect.request.dto';
import type { AddRepairRequestDto } from './dto/add-repair.request.dto';
import type {
  VehicleResponseDto,
  DefectResponseDto,
  RepairResponseDto,
} from './dto/vehicle.response.dto';

@Injectable()
export class VehiclesHttpMapper {
  toCreateCommand(tenantId: string, dto: CreateVehicleRequestDto): CreateVehicleCommand {
    return new CreateVehicleCommand(
      tenantId,
      dto.licensePlate,
      dto.vehicleType,
      dto.brand,
      dto.model,
      dto.year,
      dto.capacity,
      dto.observations ?? '',
    );
  }

  toUpdateCommand(
    vehicleId: string,
    tenantId: string,
    dto: UpdateVehicleRequestDto,
  ): UpdateVehicleCommand {
    return new UpdateVehicleCommand(
      vehicleId,
      tenantId,
      dto.brand,
      dto.model,
      dto.year,
      dto.capacity,
      dto.observations,
      dto.status,
    );
  }

  toAddDefectCommand(vehicleId: string, tenantId: string, dto: AddDefectRequestDto): AddDefectCommand {
    return new AddDefectCommand(vehicleId, tenantId, dto.description);
  }

  toAddRepairCommand(vehicleId: string, tenantId: string, dto: AddRepairRequestDto): AddRepairCommand {
    return new AddRepairCommand(
      vehicleId,
      tenantId,
      dto.description,
      new Date(dto.date),
      dto.cost ?? null,
      dto.mechanic ?? null,
      dto.notes ?? null,
    );
  }

  toResponse(vehicle: Vehicle): VehicleResponseDto {
    return {
      id: vehicle.id,
      tenantId: vehicle.tenantId,
      licensePlate: vehicle.licensePlate,
      vehicleType: vehicle.vehicleType,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      capacity: vehicle.capacity,
      defects: vehicle.defects.map((d): DefectResponseDto => ({
        id: d.id,
        description: d.description,
        reportedAt: d.reportedAt.toISOString(),
        resolvedAt: d.resolvedAt ? d.resolvedAt.toISOString() : null,
        status: d.status,
      })),
      repairs: vehicle.repairs.map((r): RepairResponseDto => ({
        id: r.id,
        description: r.description,
        date: r.date.toISOString().split('T')[0],
        cost: r.cost,
        mechanic: r.mechanic,
        notes: r.notes,
      })),
      observations: vehicle.observations,
      linkedDriverId: vehicle.linkedDriverId,
      status: vehicle.status,
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
    };
  }
}
