export const CONSTANT = {
  LOGGER_NAME: 'LOGGER',
  PROTO_FILE_PATH: (protoFilename: string) => {
    return `../../../proto-files/${protoFilename}`;
  },
  JWT_PASSWORD: 'asdfgh',
  BASIC_PASSWORD: 'Xyz@1234',
  BASIC_USERNAME: 'XYZ',
  PASSWORD_HASH_SALT: 'D4XqxvRjf678LPYZAMNBOT7zkrqG3E2H',
  OTP_EXPIRE_TIME: 30,
};

export const PROTO = {
  PROTO_FILE_NAME: 'user.proto',
  PACKAGE_NAME: 'userPackage',
  SERVICES: {
    USER_SERVICE: {
      NAME: 'UserService',
      CREATE_USER_METHOD: 'CreateUser',
    },
  },
};
export const GRPC = {
  PROTO_FILE_OPTIONS: {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  },
};

export const Swagger = {
  Title: 'Swagger Title',
  Description: 'A Documentation for Nest.js Boilerplate APIs',
  Version: '1.0',
  AddApiKey: {
    Type: 'apiKey',
    Name: 'Authorization',
    In: 'header',
  },
  AuthType: 'basic',
  Path: 'swagger',
};
