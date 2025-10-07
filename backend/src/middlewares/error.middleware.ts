import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ApiError from "@/utils/ApiError";
import { HTTP_STATUS, ERROR_MESSAGES } from "@/config/constants";
import { isDevelopment } from "@/config/env";

const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = err;

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest("Validation error", errors);
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    error = ApiError.conflict(`${field} already exists`);
  }

  // Mongoose cast error
  if (err instanceof mongoose.Error.CastError) {
    error = ApiError.badRequest(`Invalid ${err.path}: ${err.value}`);
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = ApiError.unauthorized("Invalid token");
  }

  if (err.name === "TokenExpiredError") {
    error = ApiError.unauthorized("Token has expired");
  }

  const statusCode =
    error instanceof ApiError
      ? error.statusCode
      : HTTP_STATUS.INTERNAL_SERVER_ERROR;

  const message =
    error instanceof ApiError
      ? error.message
      : ERROR_MESSAGES.INTERNAL_SERVER_ERROR;

  const response: any = {
    success: false,
    message,
    statusCode,
  };

  if (error instanceof ApiError && error.errors) {
    response.errors = error.errors;
  }

  // Include stack trace in development
  if (isDevelopment) {
    response.stack = err.stack;
  }

  console.error("❌ Error:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
  });

  res.status(statusCode).json(response);
};

// Handle 404 errors
export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const error = ApiError.notFound(`Route ${req.originalUrl} not found`);
  next(error);
};

export default errorHandler;
