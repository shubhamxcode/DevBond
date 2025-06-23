/**
 * Custom API Error class for standardized error responses
 */
class ApiError extends Error {
    statusCode: number;
    data: null;
    success: boolean;
    errors: Error[];
    
    /**
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Error message
     * @param {Array} errors - Additional error details
     * @param {string} stack - Error stack trace
     */
    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: Error[] = [],
        stack: string = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.errors = errors;
        
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;