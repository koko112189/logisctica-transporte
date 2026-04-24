import { VehicleStatus } from '../enums/vehicle-status.enum';
import { VehicleType } from '../enums/vehicle-type.enum';
import { Defect } from '../value-objects/defect.vo';
import { Repair } from '../value-objects/repair.vo';

export class Vehicle {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly licensePlate: string,
    public readonly vehicleType: VehicleType,
    public readonly brand: string,
    public readonly model: string,
    public readonly year: number,
    public readonly capacity: number,
    public readonly defects: Defect[],
    public readonly repairs: Repair[],
    public readonly observations: string,
    public readonly linkedDriverId: string | null,
    public readonly status: VehicleStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  withDefect(defect: Defect): Vehicle {
    return new Vehicle(
      this.id, this.tenantId, this.licensePlate, this.vehicleType,
      this.brand, this.model, this.year, this.capacity,
      [...this.defects, defect],
      this.repairs, this.observations, this.linkedDriverId,
      this.status, this.createdAt, new Date(),
    );
  }

  withResolvedDefect(defectId: string): Vehicle {
    const now = new Date();
    const defects = this.defects.map((d) =>
      d.id === defectId ? d.resolve(now) : d,
    );
    return new Vehicle(
      this.id, this.tenantId, this.licensePlate, this.vehicleType,
      this.brand, this.model, this.year, this.capacity,
      defects, this.repairs, this.observations, this.linkedDriverId,
      this.status, this.createdAt, now,
    );
  }

  withRepair(repair: Repair): Vehicle {
    return new Vehicle(
      this.id, this.tenantId, this.licensePlate, this.vehicleType,
      this.brand, this.model, this.year, this.capacity,
      this.defects, [...this.repairs, repair],
      this.observations, this.linkedDriverId,
      this.status, this.createdAt, new Date(),
    );
  }
}
