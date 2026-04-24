import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DomainExceptionFilter } from './shared/presentation/filters/domain-exception.filter';
import { SWAGGER_JWT_AUTH } from './shared/presentation/swagger/swagger.constants';

export function applyHttpGlobals(app: INestApplication): void {
  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new DomainExceptionFilter());
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Logística API')
    .setDescription('Documentación de endpoints (TMS / logística).')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Access token JWT (cabecera Authorization: Bearer + token)',
      },
      SWAGGER_JWT_AUTH,
    )
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'docs/json',
  });
}
