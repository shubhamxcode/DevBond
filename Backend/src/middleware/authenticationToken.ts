import { Request, Response, NextFunction } from 'express';
import ApiError from "../utils/apierror";
import asyncHandler from "../utils/asynchandler";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/userschema";
import { Document } from "mongoose";

// Extend Express Request type to include user
interface UserDocument extends Document {
  _id: string | object;
  username: string;
  email: string;
  selectedField?: string;
  refreshToken?: string;
}

// Augment Express Request 
declare module 'express-serve-static-core' {
  interface Request {
    user?: UserDocument;
  }
}

const verifyJwt = asyncHandler(async(req: Request, _: Response, next: NextFunction) => {
  try {
    // Get token from cookies or Authorization header
    const token = req.cookies?.accessToken || 
                 req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      throw new ApiError(401, "Authentication required. Please login.");
    }
    
    // Verify token
    let decodedToken: JwtPayload;
    try {
      decodedToken = Jwt.verify(
        token, 
        process.env.ACCESS_TOKEN_SECRET as string
      ) as JwtPayload;
    } catch {
      // Error details intentionally ignored since we throw a custom error
      throw new ApiError(401, "Invalid or expired token");
    }
    
    // Find user by ID from token
    const user = await User.findById(decodedToken._id).select("-password");
    if (!user) {
      throw new ApiError(401, "Invalid user token");
    }
    
    // Attach user to request object
    req.user = user as UserDocument;
    next();
  } catch (error) {
    // Specific error messages for different scenarios
    if (error instanceof Jwt.TokenExpiredError) {
      throw new ApiError(401, "Token has expired");
    } else if (error instanceof Jwt.JsonWebTokenError) {
      throw new ApiError(401, "Invalid token format");
    } else if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(401, "Authentication failed");
    }
  }
});

export default verifyJwt;