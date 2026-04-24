import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyHttpGlobals } from './app-http.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyHttpGlobals(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();