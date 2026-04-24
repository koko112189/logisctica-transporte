export class CompleteAppointmentCommand {
  constructor(
    public readonly appointmentId: string,
    public readonly tenantId: string,
  ) {}
}
