import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  if (process.env['NODE_ENV'] === 'development') {
    app.enableCors();

    // setup swagger only on development
    const config = new DocumentBuilder()
      .setTitle('Peerprep account service')
      .setDescription('The peerprep account service API')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  } else {
    app.enableCors(); // TODO: configure origin for prod
  }

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT || 8081, '0.0.0.0');
}
bootstrap();
