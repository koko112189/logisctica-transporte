export class RefreshToken {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly tenantId: string | null,
    public readonly tokenHash: string,
    public readonly expiresAt: Date,
    public readonly isRevoked: boolean,
    public readonly createdAt: Date,
  ) {}

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }
}
