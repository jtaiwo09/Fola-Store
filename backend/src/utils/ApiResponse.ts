import { Response } from "express";

interface ApiResponseData {
  success: boolean;
  message?: string;
  data?: any;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    unreadCount?: number;
  };
}

class ApiResponse {
  static success(
    res: Response,
    statusCode: number,
    message: string,
    data?: any,
    pagination?: ApiResponseData["pagination"]
  ): Response {
    const response: ApiResponseData = {
      success: true,
      message,
      data,
    };

    if (pagination) {
      response.pagination = pagination;
    }

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    statusCode: number,
    message: string,
    errors?: any[]
  ): Response {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  static created(res: Response, message: string, data?: any): Response {
    return this.success(res, 201, message, data);
  }

  static ok(res: Response, message: string, data?: any): Response {
    return this.success(res, 200, message, data);
  }

  static noContent(res: Response): Response {
    return res.status(204).send();
  }
}

export default ApiResponse;
