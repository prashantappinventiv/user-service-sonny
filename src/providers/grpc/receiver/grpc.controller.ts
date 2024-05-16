import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PROTO } from 'src/common/constant';
import { RESPONSE_DATA } from 'src/common/responses';
import { GrpcServiceInterface } from 'src/interfaces/grpc.service.interface';
import { ResUtils } from 'src/common/grpc.response';
import { ClientOnBoardingService } from 'src/modules/client/on-boarding/on-boarding.service';
import { JwtService } from '@nestjs/jwt';
import { Metadata } from '@grpc/grpc-js';

@Controller('')
export class GrpcController {
  constructor(
    private readonly clientOnboardingService: ClientOnBoardingService,
    private readonly jwtService: JwtService,
  ) {}
  /**
   * gRPC method to handle the 'CreateUser' request from the 'UserService'.
   * @param data The data object containing information to create a user.
   * @returns A Promise resolving to an object with the following structure:
   *   - status: HTTP status code indicating the result of the operation.
   *   - message: A human-readable message describing the result.
   *   - timestamp: The timestamp when the operation was performed.
   *   - data: Additional data related to the operation, typically the created user information.
   *   - error: A string containing details of any error that occurred during the operation.
   */

  @GrpcMethod(
    PROTO.SERVICES.USER_SERVICE.NAME,
    PROTO.SERVICES.USER_SERVICE.CREATE_USER_METHOD,
  )
  async createUser(
    data: GrpcServiceInterface.IgetUser,
    metadata: Metadata,
  ): Promise<{
    status: number;
    message: string;
    timestamp: number;
    data: string;
    error: string;
  }> {
    try {
      console.log('inside grpc');
      const authHeader = metadata.get('authorization')[0];
      let token: string;

      if (Buffer.isBuffer(authHeader)) {
        token = authHeader.toString('utf-8').split(' ')[1];
      } else {
        token = (authHeader as string).split(' ')[1];
      }

      console.log('tokne is ', token);

      if (!token) {
        throw new Error('No token provided');
      }

      const responseData = await this.clientOnboardingService.getUser(data);
      if (responseData) {
        return ResUtils.grpcSuccessResponse(
          responseData,
          RESPONSE_DATA.SUCCESS,
        );
      } else {
        return ResUtils.grpcErrorResponse(responseData, RESPONSE_DATA.ERROR);
      }
    } catch (error) {
      return ResUtils.grpcErrorResponse(error, RESPONSE_DATA.ERROR);
    }
  }
}
