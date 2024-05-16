/**
 * @file response
 * @description defines response for entity
 */

import { HttpStatus } from '@nestjs/common';

export const RESPONSE_MSG = {
  SUCCESS: 'Success.',
  ERROR: 'Something went wrong.',
  SESSION_EXPIRED: 'Session Expired.',
  CLIENT_NOT_EXIST: 'Client not exists.',
  INVALID_AUTHORIZATION_TOKEN: 'Invalid authorization token.',
  CLIENT_ALREADY_EXIST:
    'Entered phone number and email is already associated with an account.',
  ACCOUNT_BLOCKED:
    'Account has been temporarily blocked. Please contact with admin support.',
};

export const RESPONSE_DATA = {
  SUCCESS: {
    statusCode: HttpStatus.OK,
    message: RESPONSE_MSG.SUCCESS,
  },
  ERROR: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: RESPONSE_MSG.ERROR,
  },
  CLIENT_ALREADY_EXIST: {
    statusCode: HttpStatus.BAD_REQUEST,
    message: RESPONSE_MSG.CLIENT_ALREADY_EXIST,
  },
};
