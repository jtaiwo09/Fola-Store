import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { config } from "./env";

let io: Server;

export const initializeSocket = (server: HttpServer) => {
  const allowedOrigins = [
    config.CLIENT_URL,
    config.ADMIN_URL,
    config.DEV_CLIENT_URL,
    config.PROD_CLIENT_URL,
    "http://localhost:3000",
    "http://localhost:3001",
  ].filter((url): url is string => !!url);
  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    // Join admin room
    socket.on("join-admin", (userId: string) => {
      socket.join(`admin-${userId}`);
      console.log(`👤 Admin ${userId} joined notifications`);
    });

    // Leave admin room
    socket.on("leave-admin", (userId: string) => {
      socket.leave(`admin-${userId}`);
      console.log(`👤 Admin ${userId} left notifications`);
    });

    // For customers/store clients
    socket.on("join-store", () => {
      socket.join("store-settings");
      console.log(`🛍️ Store client joined settings room`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Emit notification to specific admin user
export const emitToAdmin = (userId: string, event: string, data: any) => {
  if (io) {
    io.to(`admin-${userId}`).emit(event, data);
  }
};

// Emit notification to all admins
export const emitToAllAdmins = async (event: string, data: any) => {
  if (io) {
    // Get all admin users from database
    const User = (await import("@/models/User")).default;
    const admins = await User.find({
      role: { $in: ["admin", "staff"] },
    }).select("_id");

    admins.forEach((admin) => {
      io.to(`admin-${admin._id}`).emit(event, data);
    });
  }
};

export const emitToStoreClients = (event: string, data: any) => {
  if (io) {
    io.to("store-settings").emit(event, data);
  }
};
