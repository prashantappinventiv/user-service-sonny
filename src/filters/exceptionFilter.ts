import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RESPONSE_MSG } from 'src/common/responses';
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage = RESPONSE_MSG.ERROR;

    if (exception.details) {
      // gRPC error handling
      errorMessage = exception.details;
    } else if (exception.response) {
      errorMessage = Array.isArray(exception.response.message)
        ? exception.response.message[0]
        : exception.response.message;
    }

    const responseBody = {
      status: httpStatus,
      success: false,
      error: errorMessage,
      message: errorMessage,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      timestamp: new Date().toISOString(),
    };
    // Log error using Winston
    this.logger.error(`${httpStatus} - ${errorMessage}`, {
      exception,
      timestamp: new Date().toISOString(),
      path: request.url,
    });

    // Send response
    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
