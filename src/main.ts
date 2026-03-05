import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const port = process.env.PORT || process.env.ALWAYSDATA_HTTPD_PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Inventory | Backend | TShockDS')
    .setDescription('The Inventory backend app')
    .setVersion('1.0.0')
    .addTag('auth')
    .addTag('inventory')
    .addTag('lote')
    .addTag('movimiento')
    .addTag('producto')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  app.enableCors({
    credentials: true,
    origin: [
      'https://boyd-unclamped-sawyer.ngrok-free.dev',
      'http://localhost:3000',
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(helmet());

  await app.listen(
    port,
    process.env.ALWAYSDATA_HTTPD_IP || process.env.IP || '127.0.0.1',
    () => {
      console.log('[Backend] Running on port ' + port);
    },
  );
}
bootstrap();
