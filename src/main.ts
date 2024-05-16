import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './middleware/logging.middleware';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CONSTANT, PROTO, Swagger } from './common/constant';
import { join } from 'path';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { APP_CONFIG } from 'config/configuration';

async function bootstrap() {
  // Create the NestJS application

  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks(); // Enable shutdown hooks to gracefully handle shutdown

  // Use express middleware to parse JSON requests and store the raw request body
  app.use(
    express.json({
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  // Use global validation pipe for automatic input validation
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  //connect to producer
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'producer',
      },
    },
  });

  // Connect to Kafka consumer
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'consumer',
      },
    },
  });
  await app.startAllMicroservices();
  // Enable CORS for the application
  app.enableCors();

  // Use custom logger middleware and set up Winston logger
  app.use(new LoggerMiddleware().use);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.useGlobalInterceptors(new LoggingInterceptor(app.get(Logger)));

  // Get the configuration service to retrieve environment variables
  const configService = app.get(ConfigService);

  // Retrieve the HTTP port from the configuration or use a default value
  const nestPort = APP_CONFIG.port;
  console.log('port is', nestPort);

  const config = new DocumentBuilder()
    .setTitle(Swagger.Title)
    .setDescription(Swagger.Description)
    .setVersion(Swagger.Version)
    .addApiKey(
      {
        type: 'apiKey',
        name: Swagger.AddApiKey.Name,
        in: Swagger.AddApiKey.In,
      },
      Swagger.AuthType,
    )
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(Swagger.Path, app, document);

  // Start the NestJS application
  await app.listen(nestPort);
  console.info(`User server listening on Port: ${nestPort}`);

  // GRPC connection setup starts here

  // Retrieve the GRPC port from the configuration or use a default value
  const grpcPort: number = configService.get<number>('GRPC_PORT') || 8008;

  // Create a NestJS microservice for GRPC with specified options
  const grpcServer = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: `localhost:${grpcPort}`,
        package: PROTO.PACKAGE_NAME,
        protoPath: join(__dirname, CONSTANT.PROTO_FILE_PATH('user.proto')),
        loader: {
          keepCase: true,
          longs: String,
          enums: String,
          defaults: true,
          oneofs: true,
        },
        keepalive: {
          keepaliveTimeoutMs: 5000,
          keepaliveTimeMs: 10000,
          keepalivePermitWithoutCalls: 1,
          http2MaxPingsWithoutData: 0,
        },
      },
    },
  );

  // Start the GRPC microservice
  await grpcServer.listen();
  console.log(`gRPC server listening on Port: ${grpcPort}`);
}

// Call the bootstrap function to start the application
bootstrap();
