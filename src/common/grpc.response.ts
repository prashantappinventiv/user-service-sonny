// Import necessary interfaces for response handling
import { GrpcResponse, IHttpResponse } from 'src/interfaces/globle.interface';
// Utility class for handling gRPC responses and creating consistent HTTP responses
export class ResponseUtils {
  // Convert a gRPC response to a standardized HTTP response
  grpcResponseHandler(res: GrpcResponse): IHttpResponse {
    const response: IHttpResponse = {
      status: res.status,
      message: res.message,
      timestamp: res.timestamp,
      // Parse JSON data if available
      data: res.data ? JSON.parse(res.data) : null,
      // Parse JSON error if available
      error: res.error ? JSON.parse(res.error) : null,
    };

    return response;
  }
  // Create a successful gRPC response
  grpcSuccessResponse(data: any, status: any): GrpcResponse {
    const response: GrpcResponse = {
      // Extract status code from the provided status object
      status: status?.statusCode,
      message: status?.message,
      timestamp: new Date().getTime(),
      // Convert data to a JSON string
      data: JSON.stringify(data),
      // Initialize error as an empty string for successful responses
      error: '',
    };
    return response;
  }

  // Create an error gRPC response
  grpcErrorResponse(error: any, status: any): GrpcResponse {
    const response: GrpcResponse = {
      // Extract status code from the provided status object
      status: status?.statusCode,
      message: status?.message,
      timestamp: new Date().getTime(),
      // Initialize data as an empty string for error responses
      data: '',
      // Include the error object in the response
      error: error,
    };
    return response;
  }
}

// Singleton instance of the ResponseUtils class for convenient usage
export const ResUtils = new ResponseUtils();
