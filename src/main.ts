import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,        // remove filds not present in DTOs
      forbidNonWhitelisted: true, // error if the request arrives with extra fields
      transform: true,        // string to int parse in params
      transformOptions: {
        enableImplicitConversion: true, // allows basic type conversion
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Employee Manager API')
    .setDescription('Employee management API')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-user-role',
        in: 'header',
      },
        'x-user-role', // only for tests purpose
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // docs em http://localhost:3000/api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
