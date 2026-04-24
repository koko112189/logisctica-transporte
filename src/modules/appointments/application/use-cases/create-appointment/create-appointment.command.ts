export interface LocationInput {
  address: string;
  city: string;
  lat?: number;
  lng?: number;
}

export class CreateAppointmentCommand {
  constructor(
    public readonly tenantId: string,
    public readonly vehicleId: string,
    public readonly driverId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly origin: LocationInput,
    public readonly destination: LocationInput,
    public readonly scheduledAt: Date,
    public readonly estimatedDurationMinutes: number,
  ) {}
}
