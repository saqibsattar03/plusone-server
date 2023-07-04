import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { json, urlencoded } from 'express';
import * as process from 'process';
import * as admin from 'firebase-admin';

//*** firebase configuration for FCM *** //
// eslint-disable-next-line @typescript-eslint/no-var-requires
const serviceAccount = require('../src/fcm-config.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: false,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  /*** firebase fcm config ***/
  // admin.initializeApp({
  //   // credential: admin.credential.cert(serviceAccount),
  // });

  const config = new DocumentBuilder()
    .setTitle('Plus-One')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  app.useStaticAssets(join(process.cwd(), '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.enableCors();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  const port = 3000;
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(port, '0.0.0.0');
  console.log(`App is running on ${port}`);
}
export const messaging = admin.messaging();
bootstrap().then();
