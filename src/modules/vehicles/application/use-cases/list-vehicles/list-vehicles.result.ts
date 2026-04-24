import type { Vehicle } from '../../../domain/entities/vehicle.entity';

export class ListVehiclesResult {
  constructor(
    public readonly items: Vehicle[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
