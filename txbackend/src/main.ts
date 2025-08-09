import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefijo global (opcional pero recomendado)
  app.setGlobalPrefix('api');

  // CORS: permite al front (Next) hablar con Nest
  app.enableCors({
    origin: [
      'http://localhost:3000', // Next dev
      // agrega dominios de producción si corresponde, p.ej. 'https://tu-dominio.com'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });


  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('DrizaTx API')
    .setDescription('Documentación de la API REST del backend DrizaTx')
    .setVersion('1.0')
    .addTag('drizatx')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Esto expone en /docs

  await app.listen(3001);
}
bootstrap();
