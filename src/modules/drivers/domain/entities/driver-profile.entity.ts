export class DriverProfile {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly userId: string,
    public readonly licenseNumber: string,
    public readonly licenseExpiry: Date,
    public readonly assignedVehicleId: string | null,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  withUpdatedFields(fields: {
    licenseNumber?: string;
    licenseExpiry?: Date;
    assignedVehicleId?: string | null;
    isActive?: boolean;
  }): DriverProfile {
    return new DriverProfile(
      this.id, this.tenantId, this.userId,
      fields.licenseNumber ?? this.licenseNumber,
      fields.licenseExpiry ?? this.licenseExpiry,
      fields.assignedVehicleId !== undefined ? fields.assignedVehicleId : this.assignedVehicleId,
      fields.isActive ?? this.isActive,
      this.createdAt, new Date(),
    );
  }

  assignVehicle(vehicleId: string): DriverProfile {
    return this.withUpdatedFields({ assignedVehicleId: vehicleId });
  }

  deactivate(): DriverProfile {
    return this.withUpdatedFields({ isActive: false });
  }
}
