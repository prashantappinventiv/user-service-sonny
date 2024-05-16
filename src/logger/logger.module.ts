import { Module } from '@nestjs/common';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { CONSTANT } from 'src/common/constant';

@Module({
  imports: [
    WinstonModule.forRoot({
      transports: [
        // Console transport for logging to the terminal
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike(CONSTANT.LOGGER_NAME, {
              colors: true,
              prettyPrint: true,
            }),
            winston.format.printf(
              (info: any) =>
                `${info.level}: ${[info.timestamp]} ${info.message} }`,
            ),
          ),
        }),
      ],
    }),
  ],
})
export class LoggerModule {}
