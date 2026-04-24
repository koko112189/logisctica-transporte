import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import * as bcrypt from 'bcryptjs';
import { User } from '../../modules/users/domain/entities/user.entity';
import type { UserRepositoryPort } from '../../modules/users/domain/ports/user.repository.port';
import { USER_REPOSITORY } from '../../modules/users/users.di-tokens';

@Injectable()
export class SuperAdminSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(SuperAdminSeeder.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email = this.config.getOrThrow<string>('SUPERADMIN_EMAIL');
    const existing = await this.users.findByEmail(email);
    if (existing) return;

    const password = this.config.getOrThrow<string>('SUPERADMIN_PASSWORD');
    const name = this.config.get<string>('SUPERADMIN_NAME', 'Super Admin');
    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date();

    const superAdmin = new User(
      randomUUID(),
      null,
      email,
      name,
      hashedPassword,
      true,
      true,
      [],
      now,
      now,
    );

    await this.users.save(superAdmin);
    this.logger.log(`SuperAdmin creado: ${email}`);
  }
}
