import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SwaggerTheme } from 'swagger-themes';
import os from 'os';
import cluster from 'cluster';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Api')
    .setVersion('0.1')
    .addBearerAuth({
      description: 'Infomar o JWT para autorizar o acesso',
      name: 'Authorization',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const theme = new SwaggerTheme('v3');

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customCss: theme.getBuffer('dark'),
  });

  const port = 8000;
  await app.listen(port);
}

//bootstrap();

const runPrimaryProcess = () => {
  const processesCount = os.cpus().length * 2;
  //const processesCount = 1;
  for (let i = 0; i < processesCount; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`,
    );
    console.log('Starting a new worker');
    cluster.fork();
  });
};

const runWorkerProcess = async () => {
  await bootstrap();
};

cluster.isPrimary ? runPrimaryProcess() : runWorkerProcess();
