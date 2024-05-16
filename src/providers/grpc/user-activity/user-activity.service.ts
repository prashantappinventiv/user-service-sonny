import { credentials } from '@grpc/grpc-js';
import { firstValueFrom } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { PROTO } from 'src/common/constant';
import { ConfigService } from '@nestjs/config';
import { GrpcService } from '../grpc.service';
import { GrpcServiceInterface } from 'src/interfaces/grpc.service.interface';
import { GrpcResponse } from 'src/interfaces/globle.interface';
import { ResUtils } from 'src/common/grpc.response';

/**
 * Injectable service responsible for communication with the gRPC-based Processor microservice.
 * Extends the base GrpcService class for common gRPC functionality.
 */
@Injectable()
export class UserGrpcService extends GrpcService {
  private ProcessorService: any; // gRPC client for Processor microservice
  // private logger = new Logger(ProcessorGrpcService.name); // Logger instance for logging

  /**
   * Constructor for ProcessorGrpcService.
   * @param configService The configuration service for retrieving environment-specific settings.
   */
  constructor(private readonly configService: ConfigService) {
    // Initialize the GrpcService with the protobuf file and package information
    super(PROTO.PROTO_FILE_NAME, PROTO.PACKAGE_NAME);

    // Load the gRPC service during instantiation
    this.loadService();
  }

  // Retrieve configuration values or use defaults if not present
  private processorServiceGrpcPort: number =
    this.configService.get<number>('PROCESSOR_SERVICE_GRPC_PORT') || 8004;
  private baseUrl: string =
    this.configService.get<string>('BASE_URL') || '127.0.0.1';

  /**
   * Load all services of the Processor microservice.
   * Constructs the gRPC client for ProcessorService.
   */
  private loadService(): void {
    const url = `${this.baseUrl}:${this.processorServiceGrpcPort}`;
    console.log('Processor Service URL', url);

    // Initialize the gRPC client with SSL credentials
    this.ProcessorService = new this.package.UserService(
      url,
      credentials.createInsecure(),
    );
  }

  /**
   * Handles the 'CreateUser' gRPC request by invoking the corresponding service method.
   * @param payload The data object containing information to create a user.
   * @returns A Promise resolving to the gRPC response after handling the 'CreateUser' request.
   * @throws If an error occurs during the 'CreateUser' operation, it is rejected with the error details.
   */
  async getUser(payload: GrpcServiceInterface.IgetUser) {
    try {
      console.log('inside get user before firstValue function', payload);
      // Invoke the 'CreateUser' service method and handle the response
      const res: GrpcResponse = await firstValueFrom(
        this.invokeService(
          this.ProcessorService,
          PROTO.SERVICES.USER_SERVICE.CREATE_USER_METHOD,
          payload,
        ),
      );
      console.log('RESPONSE: GRPC | ProcessorGrpcService | CreateUser');
      console.log(res);
      return ResUtils.grpcResponseHandler(res);
    } catch (error) {
      // If an error occurs during the 'CreateUser' operation, reject the Promise with the error
      return Promise.reject(error);
    }
  }
}
