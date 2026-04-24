export class StartAppointmentCommand {
  constructor(
    public readonly appointmentId: string,
    public readonly tenantId: string,
  ) {}
}
