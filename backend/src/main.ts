import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Allow the React frontend to talk to this API
  app.enableCors({ origin: 'http://localhost:5173' });

  // Automatically validate incoming request bodies using class-validator
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger UI available at http://localhost:3000/api
  const config = new DocumentBuilder()
    .setTitle('Shopping Cart API')
    .setDescription('API for the shopping cart assignment')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api`);
}

bootstrap();
