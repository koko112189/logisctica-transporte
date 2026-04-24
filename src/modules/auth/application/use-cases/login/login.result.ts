export class LoginResult {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}
