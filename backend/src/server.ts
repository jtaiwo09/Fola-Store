import { config } from "@/config/env";
import connectDB from "@/config/database";
import app from "./app";
import { createServer } from "http";
import { initializeSocket } from "./config/socket";

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB();

    // Create HTTP server
    const server = createServer(app);

    // Initialize Socket.IO
    initializeSocket(server);

    // Start server
    server.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}        ║
  Environment: ${config.NODE_ENV.padEnd(16)}
  URL: http://localhost:${config.PORT}  
      `);
      console.log(`📡 Socket.IO initialized`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n⚠️  ${signal} received. Starting graceful shutdown...`);

      server.close(() => {
        console.log("✅ HTTP server closed");
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        console.error("❌ Forcing shutdown after timeout");
        process.exit(1);
      }, 30000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle unhandled promise rejections
    process.on("unhandledRejection", (err: Error) => {
      console.error("❌ Unhandled Rejection:", err);
      server.close(() => process.exit(1));
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
