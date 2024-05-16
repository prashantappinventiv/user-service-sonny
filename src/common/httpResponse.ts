import { HttpException } from '@nestjs/common';
import { Response } from 'express';
export class HttpResponse {
  // constructor() {}

  /** response from the server */
  async sendResponse(
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    data?: object,
  ) {
    const response = {
      statusCode: statusCode,
      success: success,
      message: message,
      data: data ? data : {},
    };
    res.status(statusCode).json(response);
  }
  async sendErrorResponse(
    res: Response,
    statusCode: number,
    message: string,
    data?: object,
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    type: string = 'BAD_REQUEST',
  ) {
    const response = {
      statusCode: statusCode,
      success: false,
      message: message,
      type: type,
    };
    throw new HttpException(response, statusCode);
  }
}
