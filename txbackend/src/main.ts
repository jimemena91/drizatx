import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('DrizaTx API')
    .setDescription('Documentación de la API REST del backend DrizaTx')
    .setVersion('1.0')
    .addTag('drizatx')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); // Esto expone en /docs

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
