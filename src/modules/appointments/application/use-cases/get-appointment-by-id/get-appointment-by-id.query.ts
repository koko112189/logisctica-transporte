export class GetAppointmentByIdQuery {
  constructor(
    public readonly appointmentId: string,
    public readonly tenantId: string,
  ) {}
}
