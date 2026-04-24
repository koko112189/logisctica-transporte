import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { CoordinatesVO } from '../../../../shared/domain/value-objects/coordinates.vo';
import { LocationVO } from '../../../../shared/domain/value-objects/location.vo';
import { Trip } from '../../domain/entities/trip.entity';
import type { TripFilters, TripRepositoryPort } from '../../domain/ports/trip.repository.port';
import { TripAuditEntry } from '../../domain/value-objects/trip-audit-entry.vo';
import { TripStop } from '../../domain/value-objects/trip-stop.vo';
import { TripStatus } from '../../domain/enums/trip-status.enum';
import { TripSchemaClass } from './trip.schema';

type LeanStop = { stopOrder: number; pickupPointId: string; type: string; scheduledArrival: Date | null; actualArrival: Date | null; status: string; notes: string | null; storeDeliveryId: string | null };
type LeanAudit = { timestamp: Date; event: string; description: string; metadata: Record<string, unknown> | null; performedByUserId: string | null };
type LeanCoords = { lat: number; lng: number } | null;
type LeanLoc = { address: string; city: string; coordinates: LeanCoords };
type LeanTrip = { _id: { toString(): string }; tenantId: string; vehicleId: string; driverId: string; appointmentId: string | null; vehicleCategory: string; isExternalCarrier: boolean; domiciliaryId: string | null; externalCarrierId: string | null; externalVehicleId: string | null; originWarehouseId: string | null; origin: LeanLoc; destination: LeanLoc; stops: LeanStop[]; startedAt: Date | null; estimatedArrival: Date | null; actualArrival: Date | null; currentLocation: LeanCoords; lastLocationUpdatedAt: Date | null; status: string; checklistComplied: boolean; auditLog: LeanAudit[]; createdAt: Date; updatedAt: Date };

@Injectable()
export class MongooseTripRepository implements TripRepositoryPort {
  constructor(
    @InjectModel(TripSchemaClass.name)
    private readonly model: Model<TripSchemaClass>,
  ) {}

  async save(trip: Trip): Promise<void> {
    await this.model.findOneAndUpdate(
      { _id: trip.id },
      {
        $set: {
          tenantId: trip.tenantId,
          vehicleId: trip.vehicleId,
          driverId: trip.driverId,
          appointmentId: trip.appointmentId,
          vehicleCategory: trip.vehicleCategory,
          isExternalCarrier: trip.isExternalCarrier,
          domiciliaryId: trip.domiciliaryId,
          externalCarrierId: trip.externalCarrierId,
          externalVehicleId: trip.externalVehicleId,
          originWarehouseId: trip.originWarehouseId,
          origin: this.serializeLoc(trip.origin),
          destination: this.serializeLoc(trip.destination),
          stops: trip.stops.map((s) => ({
            stopOrder: s.stopOrder,
            pickupPointId: s.pickupPointId,
            type: s.type,
            scheduledArrival: s.scheduledArrival,
            actualArrival: s.actualArrival,
            status: s.status,
            notes: s.notes,
            storeDeliveryId: s.storeDeliveryId,
          })),
          startedAt: trip.startedAt,
          estimatedArrival: trip.estimatedArrival,
          actualArrival: trip.actualArrival,
          currentLocation: trip.currentLocation
            ? { lat: trip.currentLocation.lat, lng: trip.currentLocation.lng }
            : null,
          lastLocationUpdatedAt: trip.lastLocationUpdatedAt,
          status: trip.status,
          checklistComplied: trip.checklistComplied,
          auditLog: trip.auditLog.map((e) => ({
            timestamp: e.timestamp,
            event: e.event,
            description: e.description,
            metadata: e.metadata,
            performedByUserId: e.performedByUserId,
          })),
          createdAt: trip.createdAt,
          updatedAt: trip.updatedAt,
        },
      },
      { upsert: true, new: true },
    );
  }

  async findById(id: string, tenantId: string): Promise<Trip | null> {
    const doc = await this.model.findOne({ _id: id, tenantId }).lean<LeanTrip>();
    return doc ? this.toDomain(doc) : null;
  }

  async findAll(
    tenantId: string,
    filters: TripFilters,
    page: number,
    limit: number,
  ): Promise<{ items: Trip[]; total: number }> {
    const q: Record<string, unknown> = { tenantId };
    if (filters.vehicleId) q['vehicleId'] = filters.vehicleId;
    if (filters.driverId) q['driverId'] = filters.driverId;
    if (filters.status) q['status'] = filters.status;
    if (filters.vehicleCategory) q['vehicleCategory'] = filters.vehicleCategory;
    if (filters.isExternalCarrier !== undefined) q['isExternalCarrier'] = filters.isExternalCarrier;
    if (filters.from || filters.to) {
      const range: Record<string, Date> = {};
      if (filters.from) range['$gte'] = filters.from;
      if (filters.to) range['$lte'] = filters.to;
      q['createdAt'] = range;
    }
    const [docs, total] = await Promise.all([
      this.model.find(q).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean<LeanTrip[]>(),
      this.model.countDocuments(q),
    ]);
    return { items: docs.map((d) => this.toDomain(d)), total };
  }

  async findActiveByVehicle(vehicleId: string, tenantId: string): Promise<Trip | null> {
    const doc = await this.model
      .findOne({ vehicleId, tenantId, status: { $in: [TripStatus.IN_TRANSIT, TripStatus.DELAYED] } })
      .lean<LeanTrip>();
    return doc ? this.toDomain(doc) : null;
  }

  async findActiveByDriver(driverId: string, tenantId: string): Promise<Trip | null> {
    const doc = await this.model
      .findOne({ driverId, tenantId, status: { $in: [TripStatus.IN_TRANSIT, TripStatus.DELAYED] } })
      .lean<LeanTrip>();
    return doc ? this.toDomain(doc) : null;
  }

  private serializeLoc(loc: Trip['origin']) {
    return {
      address: loc.address,
      city: loc.city,
      coordinates: loc.coordinates ? { lat: loc.coordinates.lat, lng: loc.coordinates.lng } : null,
    };
  }

  private toDomain(doc: LeanTrip): Trip {
    const toLoc = (l: LeanLoc) =>
      new LocationVO(l.address, l.city, l.coordinates ? new CoordinatesVO(l.coordinates.lat, l.coordinates.lng) : null);

    return new Trip(
      doc._id.toString(),
      doc.tenantId,
      doc.vehicleId,
      doc.driverId,
      doc.appointmentId,
      doc.vehicleCategory as Trip['vehicleCategory'],
      doc.isExternalCarrier,
      doc.domiciliaryId,
      doc.externalCarrierId ?? null,
      doc.externalVehicleId ?? null,
      doc.originWarehouseId ?? null,
      toLoc(doc.origin),
      toLoc(doc.destination),
      doc.stops.map(
        (s) => new TripStop(s.stopOrder, s.pickupPointId, s.type as TripStop['type'], s.scheduledArrival, s.actualArrival, s.status as TripStop['status'], s.notes, s.storeDeliveryId),
      ),
      doc.startedAt,
      doc.estimatedArrival,
      doc.actualArrival,
      doc.currentLocation ? new CoordinatesVO(doc.currentLocation.lat, doc.currentLocation.lng) : null,
      doc.lastLocationUpdatedAt,
      doc.status as Trip['status'],
      doc.checklistComplied,
      doc.auditLog.map(
        (e) => new TripAuditEntry(e.timestamp, e.event as TripAuditEntry['event'], e.description, e.metadata, e.performedByUserId),
      ),
      doc.createdAt,
      doc.updatedAt,
    );
  }
}
