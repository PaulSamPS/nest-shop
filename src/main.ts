import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/modules/app/app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule, {
    cors: { origin: true, credentials: true },
  });
  const configService: ConfigService<unknown, boolean> = app.get(ConfigService);
  const port = configService.get('port');
  app.use(cookieParser(configService.get('secret_cookie')));
  app.use(
    cors({
      credentials: true,
      origin: configService.get('base_url'),
    }),
  );

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
