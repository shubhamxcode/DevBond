/**
 * Standardized API response class for successful responses
 */
class ApiResponse<T = unknown> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;

  /**
   * @param {T} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code
   */
  constructor(data: T, message: string = "Success", statusCode: number = 200) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = true;
  }
}

export default ApiResponse;