import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GrpcController } from './grpc.controller';
// import { ClientOnBoardingService } from 'src/modules/client/on-boarding/on-boarding.service';
import { DatabaseModule } from '../../database';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientOnBoardingModule } from 'src/modules/client/on-boarding/on-boarding.module';
import { UserRepository } from 'src/modules/client/on-boarding/user.repository';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    TypeOrmModule.forFeature([]),
    ClientOnBoardingModule,
    // DatabaseModule.forFeature([
    //   { name: UserDocument.name, schema: UserSchema },
    // ]),
  ],
  controllers: [GrpcController],
  providers: [
    // GrpcService,
    // ClientOnBoardingService,
    JwtService,
    ClientOnBoardingModule,
    UserRepository,
  ],
})
export class GrpcModule {}
