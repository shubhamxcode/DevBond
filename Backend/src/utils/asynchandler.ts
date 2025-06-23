import { Request, Response, NextFunction } from 'express';

type AsyncFunction = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => Promise<unknown>;

/**
 * Wrapper for async controller functions to handle errors
 * @param {Function} requestHandler - The async controller function
 * @returns {Function} Express middleware function with error handling
 */
const asyncHandler = (requestHandler: AsyncFunction) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await Promise.resolve(requestHandler(req, res, next));
    } catch (error) {
      console.error("Error occurred:", error);
      next(error);
    }
  };
};

export default asyncHandler;