import { aj } from "../config/arcjet.js";
import { CustomError } from "../utils/CustomError.js";

// Arcjet middleware for rate limiting, bot protection, and security

export const arcjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {
      requested: 1, // each request consumes 1 token
    });

    // handle denied requests
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        throw new CustomError(
          "Rate limit exceeded. Please try again later.",
          429
        );
      } else if (decision.reason.isBot()) {
        throw new CustomError("Automated requests are not allowed.", 403);
      } else {
        throw new CustomError("Access denied by security policy.", 403);
      }
    }

    // check for spoofed bots
    if (
      decision.results.some(
        (result) => result.reason.isBot() && result.reason.isSpoofed()
      )
    ) {
      throw new CustomError("Malicious bot activity detected.", 403);
    }

    next();
  } catch (error) {
    console.error("Arcjet middleware error:", error);
    // allow request to continue if Arcjet fails
    next();
  }
};
