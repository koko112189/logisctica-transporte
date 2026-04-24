import { Injectable } from '@nestjs/common';
import type { PickupPoint } from '../../domain/entities/pickup-point.entity';
import { CreatePickupPointCommand } from '../../application/use-cases/create-pickup-point/create-pickup-point.command';
import { UpdatePickupPointCommand } from '../../application/use-cases/update-pickup-point/update-pickup-point.command';
import type { CreatePickupPointRequestDto } from './dto/create-pickup-point.request.dto';
import type { UpdatePickupPointRequestDto } from './dto/update-pickup-point.request.dto';
import type { PickupPointResponseDto } from './dto/pickup-point.response.dto';

@Injectable()
export class RoutePointsHttpMapper {
  toCreateCommand(tenantId: string, dto: CreatePickupPointRequestDto): CreatePickupPointCommand {
    return new CreatePickupPointCommand(
      tenantId,
      dto.name,
      dto.type,
      dto.address,
      dto.city,
      dto.postalCode ?? null,
      dto.lat ?? null,
      dto.lng ?? null,
      dto.contactName ?? null,
      dto.contactPhone ?? null,
      dto.contactEmail ?? null,
      dto.operatingHours ?? null,
    );
  }

  toUpdateCommand(id: string, tenantId: string, dto: UpdatePickupPointRequestDto): UpdatePickupPointCommand {
    return new UpdatePickupPointCommand(
      id, tenantId,
      dto.name, dto.type,
      dto.address, dto.city,
      dto.postalCode,
      dto.lat, dto.lng,
      dto.contactName, dto.contactPhone,
      dto.contactEmail, dto.operatingHours,
    );
  }

  toResponse(point: PickupPoint): PickupPointResponseDto {
    return {
      id: point.id,
      tenantId: point.tenantId,
      name: point.name,
      type: point.type,
      address: point.address,
      city: point.city,
      postalCode: point.postalCode,
      coordinates: point.coordinates
        ? { lat: point.coordinates.lat, lng: point.coordinates.lng }
        : null,
      contactName: point.contactName,
      contactPhone: point.contactPhone,
      contactEmail: point.contactEmail,
      operatingHours: point.operatingHours,
      isActive: point.isActive,
      createdAt: point.createdAt.toISOString(),
      updatedAt: point.updatedAt.toISOString(),
    };
  }
}
