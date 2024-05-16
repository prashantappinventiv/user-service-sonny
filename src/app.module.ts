import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule, Routes } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from './logger/logger.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from 'src/filters/exceptionFilter';
import { ClientOnBoardingModule } from './modules/client/on-boarding/on-boarding.module';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { GrpcModule } from './providers/grpc/receiver/grpc.module';
import { DatabaseModule } from './providers/database';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProducerController } from './providers/kafka/producer/producer.controller';
import { ProducerService } from './providers/kafka/producer/producer.service';
import { ConsumerController } from './providers/kafka/consumer/consumer.controller';

//for routing admin and app path separately
const routes: Routes = [
  {
    path: '/client',
    children: [
      {
        path: '/onboarding',
        module: ClientOnBoardingModule,
      },
    ],
  },
];
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CONSUMER_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'consumer',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'consumer',
          },
        },
      },
    ]),
    ConfigModule.forRoot({ load: [], isGlobal: true }),
    ScheduleModule.forRoot(),
    ClientOnBoardingModule,
    DatabaseModule,
    LoggerModule,
    RouterModule.register(routes),
    GrpcModule,
  ],
  controllers: [ProducerController, ConsumerController],

  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    LoggingInterceptor,
    Logger,
    ProducerService,
  ],
})
export class AppModule {}
