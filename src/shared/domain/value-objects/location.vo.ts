import type { CoordinatesVO } from './coordinates.vo';

export class LocationVO {
  constructor(
    public readonly address: string,
    public readonly city: string,
    public readonly coordinates: CoordinatesVO | null,
  ) {}
}
