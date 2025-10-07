// backend/src/services/notification.service.ts
import Notification from "@/models/Notification";
import User from "@/models/User";
import { emitToAdmin, emitToAllAdmins } from "@/config/socket";
import { sendEmail } from "./email.service";
import { config } from "@/config/env";

interface CreateNotificationPayload {
  type: "low_stock" | "new_order" | "order_status" | "review" | "general";
  title: string;
  message: string;
  data?: any;
}

// Create notification for all admins
export const notifyAdmins = async (payload: CreateNotificationPayload) => {
  try {
    // Get all admin and staff users
    const admins = await User.find({
      role: { $in: ["admin", "staff"] },
      isActive: true,
    }).select("_id email firstName");

    if (admins.length === 0) return undefined;

    // Create notification records for each admin
    const notifications = await Notification.create(
      admins.map((admin) => ({
        recipient: admin._id,
        ...payload,
      }))
    );

    // Emit socket events to online admins
    await emitToAllAdmins("notification", {
      ...payload,
      id: notifications[0]._id,
      createdAt: notifications[0].createdAt,
    });

    // Send email notifications
    for (const admin of admins) {
      await sendEmail({
        to: admin.email,
        subject: payload.title,
        html: generateEmailTemplate(payload, admin.firstName),
      });
    }

    return notifications;
  } catch (error) {
    console.error("❌ Failed to send admin notifications:", error);
    return undefined;
  }
};

// Create notification for specific admin
export const notifyAdmin = async (
  adminId: string,
  payload: CreateNotificationPayload
) => {
  try {
    const admin = await User.findOne({
      _id: adminId,
      role: { $in: ["admin", "staff"] },
      isActive: true,
    });

    if (!admin) return undefined;

    const notification = await Notification.create({
      recipient: adminId,
      ...payload,
    });

    // Emit socket event
    emitToAdmin(adminId, "notification", {
      ...payload,
      id: notification._id,
      createdAt: notification.createdAt,
    });

    // Send email
    await sendEmail({
      to: admin.email,
      subject: payload.title,
      html: generateEmailTemplate(payload, admin.firstName),
    });

    return notification;
  } catch (error) {
    console.error(`❌ Failed to notify admin ${adminId}:`, error);
    return undefined;
  }
};

// Notify admins about low stock
export const notifyLowStock = async (product: any) => {
  await notifyAdmins({
    type: "low_stock",
    title: "⚠️ Low Stock Alert",
    message: `${product.name} is running low on stock. Current stock: ${product.totalStock} units.`,
    data: {
      productId: product._id,
      productName: product.name,
      currentStock: product.totalStock,
      threshold: product.lowStockThreshold,
    },
  });
};

// Notify admins about new order
export const notifyNewOrder = async (order: any) => {
  await notifyAdmins({
    type: "new_order",
    title: "🛒 New Order Received",
    message: `Order #${order.orderNumber} has been placed. Total: ₦${order.total.toLocaleString()}`,
    data: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      total: order.total,
      customerName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
    },
  });
};

// Generate email template
const generateEmailTemplate = (
  payload: CreateNotificationPayload,
  adminName: string
): string => {
  const dashboardUrl = `${config.CLIENT_URL}/admin`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 20px; text-align: center; }
        .content { background: #f9fafb; padding: 30px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Fola Store Admin</h1>
        </div>
        <div class="content">
          <h2>Hi ${adminName},</h2>
          <h3>${payload.title}</h3>
          <p>${payload.message}</p>
          <a href="${dashboardUrl}" class="button">View Dashboard</a>
        </div>
        <div class="footer">
          <p>This is an automated notification from Fola Store Admin</p>
          <p>© ${new Date().getFullYear()} Fola Store. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
