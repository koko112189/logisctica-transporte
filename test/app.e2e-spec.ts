import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { DomainExceptionFilter } from './../src/shared/presentation/filters/domain-exception.filter';

describe('Users (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new DomainExceptionFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('POST /users y GET /users/:id', async () => {
    const create = await request(app.getHttpServer())
      .post('/users')
      .send({ email: 'demo@example.com', name: 'Demo' })
      .expect(201);

    const createBody = create.body as { id: string };
    expect(createBody.id).toBeDefined();

    const get = await request(app.getHttpServer())
      .get(`/users/${createBody.id}`)
      .expect(200);

    const userBody = get.body as {
      email: string;
      name: string;
      createdAt: string;
    };
    expect(userBody.email).toBe('demo@example.com');
    expect(userBody.name).toBe('Demo');
    expect(userBody.createdAt).toBeDefined();
  });

  it('GET /users/:id desconocido responde 404', async () => {
    await request(app.getHttpServer())
      .get('/users/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });
});
