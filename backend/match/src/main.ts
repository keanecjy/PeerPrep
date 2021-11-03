import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('match');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );
  if (process.env['NODE_ENV'] === 'development') {
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    });

    const config = new DocumentBuilder()
      .setTitle('Peerprep match service')
      .setDescription('The peerprep match service API')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('match/api', app, document);
  } else {
    app.enableCors({ credentials: true }); // TODO: configure origin for prod
  }
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT || 8084, '0.0.0.0');
}
bootstrap();
