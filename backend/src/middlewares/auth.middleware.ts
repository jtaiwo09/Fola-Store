import { Request, Response, NextFunction } from "express";
import { verifyToken } from "@clerk/backend";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import ApiError from "@/utils/ApiError";
import asyncHandler from "@/utils/asyncHandler";
import { config } from "@/config/env";
import { ERROR_MESSAGES } from "@/config/constants";

interface JwtPayload {
  id: string;
}

// Protect routes - verify Clerk or JWT token
export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw ApiError.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    // Try Clerk token first (primary auth method for store customers)
    try {
      const clerkSession = await verifyToken(token, {
        secretKey: config.CLERK_SECRET_KEY,
      });

      if (clerkSession && clerkSession.sub) {
        // Find user by Clerk ID
        const user = await User.findOne({ clerkId: clerkSession.sub }).select(
          "-password"
        );

        if (!user) {
          throw ApiError.unauthorized(
            "User not found. Please complete registration."
          );
        }

        if (!user.isActive) {
          throw ApiError.forbidden("Account is deactivated");
        }

        req.user = user;
        return next();
      }
    } catch (clerkError: any) {
      // If Clerk verification fails, try custom JWT (for admin/staff)
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
          throw ApiError.unauthorized("User not found");
        }

        if (!user.isActive) {
          throw ApiError.forbidden("Account is deactivated");
        }

        req.user = user;
        return next();
      } catch (jwtError: any) {
        // Both auth methods failed
        console.error("Auth Error - Clerk:", clerkError.message);
        console.error("Auth Error - JWT:", jwtError.message);

        if (jwtError.name === "TokenExpiredError") {
          throw ApiError.unauthorized(ERROR_MESSAGES.TOKEN_EXPIRED);
        }
        throw ApiError.unauthorized(ERROR_MESSAGES.TOKEN_INVALID);
      }
    }

    throw ApiError.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
  }
);

// Authorize specific roles
export const authorize = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      throw ApiError.unauthorized(ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden(
        `Role '${req.user.role}' is not authorized to access this route`
      );
    }

    next();
  };
};

// Optional authentication
export const optionalAuthenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        // Try Clerk first
        const clerkSession = await verifyToken(token, {
          secretKey: config.CLERK_SECRET_KEY,
        });

        if (clerkSession && clerkSession.sub) {
          const user = await User.findOne({
            clerkId: clerkSession.sub,
          }).select("-password");

          if (user && user.isActive) {
            req.user = user;
          }
        }
      } catch {
        // Try JWT as fallback
        try {
          const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
          const user = await User.findById(decoded.id).select("-password");

          if (user && user.isActive) {
            req.user = user;
          }
        } catch {
          // Silently fail for optional authentication
        }
      }
    }

    next();
  }
);
