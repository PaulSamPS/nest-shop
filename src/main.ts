import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app/app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule, {
    cors: { origin: true, credentials: true },
  });
  const configService: ConfigService<unknown, boolean> = app.get(ConfigService);
  const port = configService.get('port');
  app.use(
    session({
      secret: 'keyword',
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const config: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
    .setTitle('Nest shop')
    .setDescription('Api documentation')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(port);
}
bootstrap();
