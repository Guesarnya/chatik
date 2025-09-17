import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
  });

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/api/public/',
  });

  // Гарантируем UTF-8 для всех JSON-ответов
  app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
