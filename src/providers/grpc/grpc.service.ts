import { Options, PackageDefinition, loadSync } from '@grpc/proto-loader';
import * as path from 'path';
import { GrpcObject, loadPackageDefinition } from '@grpc/grpc-js';
import { Observable, Observer } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { GRPC } from 'src/common/constant';
import { GrpcResponse } from 'src/interfaces/globle.interface';

/**
 * Injectable service providing common functionalities for interacting with gRPC services.
 * Handles loading of Proto files, invoking gRPC service methods, and managing gRPC streams.
 */
@Injectable()
export class GrpcService {
  public package: any;

  /**
   * Constructor for GrpcService.
   * @param protoFilename The name of the Proto file for the gRPC service.
   * @param packageName The name of the package within the Proto file.
   */
  constructor(
    private readonly protoFilename: string,
    private readonly packageName: string,
  ) {
    // Load the Proto file during instantiation
    this.loadProtoFile(this.protoFilename, this.packageName);
  }

  /**
   * Load Proto file of the gRPC service and initialize the package object.
   * @param protoFilename The name of the Proto file for the gRPC service.
   * @param packageName The name of the package within the Proto file.
   */
  private loadProtoFile(protoFilename: string, packageName: string): void {
    const protoOptions: Options = GRPC.PROTO_FILE_OPTIONS;

    const packageDefinition: PackageDefinition = loadSync(
      path.resolve('/home/appinventiv/Desktop/nest-js/proto-files/user.proto'),
      protoOptions,
    );

    const grpcObject: GrpcObject = loadPackageDefinition(packageDefinition);
    this.package = grpcObject[packageName];
  }

  /**
   * Invoke a gRPC service method with provided payload.
   * @param service The gRPC service object.
   * @param method The name of the gRPC service method to invoke.
   * @param payload The payload to send with the gRPC request.
   * @returns An Observable resolving to the gRPC response or error.
   */
  protected invokeService<Type>(
    service: any,
    method: string,
    payload: Type,
  ): Observable<GrpcResponse> {
    return new Observable((observer: Observer<any>) => {
      try {
        // Invoke the gRPC service method and handle the response
        service[method](payload, (err: Error, res: any) => {
          if (err) {
            // Log the error
            console.error(`Error invoking ${method}: ${err.message}`);

            // Emit the error to the observer
            observer.error(err);
          } else {
            // Emit the response to the observer
            observer.next(res);
            observer.complete();
          }
        });
      } catch (error) {
        // Log the error
        console.error(`Error invoking ${method}: ${error.message}`);

        // Emit the error to the observer
        observer.error(error);
      }
    });
  }
}
