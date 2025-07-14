import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Включаем CORS
  app.enableCors({
    origin: '*',
  });

  // ✅ Отдаём статику из папки /public
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/api/public/', // 👈 URL префикс
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
