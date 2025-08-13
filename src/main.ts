import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

function setupSwagger(app: any) {
  const config = new DocumentBuilder()
    .setTitle('Poke API')
    .setDescription('Pokemon')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
        name: 'Authorization',
      },
      'bearer',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  if (process.env.NODE_ENV !== 'production') setupSwagger(app);

  const PORT = Number(process.env.PORT) || 3000;
  await app.listen(PORT);
  console.info(
    `http://localhost:${PORT}${process.env.NODE_ENV !== 'production' ? '/docs' : ''}`,
  );
}
bootstrap();
