import { Module } from '@nestjs/common';
import { HttpResponse } from 'src/common/httpResponse';
import { DatabaseModule } from 'src/providers/database';
import { LoggerModule } from 'src/logger/logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDetails } from 'src/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ClientOnBoardingController } from './on-boarding.controller';
import { UserRepository } from './user.repository';
import { APP_CONFIG } from 'config/configuration';
import { ClientOnBoardingService } from './on-boarding.service';
import { UserGrpcService } from 'src/providers/grpc/user-activity/user-activity.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProducerService } from 'src/providers/kafka/producer/producer.service';

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
    DatabaseModule,
    DatabaseModule.forFeature([UserDetails]),
    TypeOrmModule.forFeature([UserDetails]),
    JwtModule.register({
      secret: APP_CONFIG.secret,
      signOptions: { expiresIn: APP_CONFIG.expires },
    }),
    // KafkaModule,
    LoggerModule,
  ],
  controllers: [ClientOnBoardingController],
  providers: [
    ClientOnBoardingService,
    HttpResponse,
    UserRepository,
    UserGrpcService,
    ProducerService,
  ],
  exports: [ClientOnBoardingService],
})
export class ClientOnBoardingModule {}
